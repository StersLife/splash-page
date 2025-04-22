// app/api/upsells/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUpsellVisible } from '@/lib/upsell-utils'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { upsellId, reservationId, quantity = 1, selectedItemId = null } = await request.json()
    
    // Validate required parameters
    if (!upsellId) {
      return Response.json(
        { error: 'Upsell ID is required' },
        { status: 400 }
      )
    }
    
    if (!reservationId) {
      return Response.json(
        { error: 'Reservation ID is required' },
        { status: 400 }
      )
    }
    
    // Validate quantity
    const parsedQuantity = parseInt(quantity.toString())
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return Response.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Fetch reservation first
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single()
      
    if (reservationError || !reservation) {
      console.error('Reservation not found:', reservationError)
      return Response.json(
        { error: 'Invalid reservation ID' },
        { status: 400 }
      )
    }
    
    // Fetch upsell with visibility rules
    const { data: upsell, error } = await supabase
      .from('upsells')
      .select('*, upsell_items (*), upsell_visibility_rules (*)')
      .eq('id', upsellId)
      .single()

    if (error || !upsell) {
      console.error('Upsell not found:', error)
      return Response.json(
        { error: 'Invalid upsell ID' },
        { status: 400 }
      )
    }
    
    // Check if the upsell is currently visible based on the rules
    const isVisible = isUpsellVisible(upsell, reservation)
    
    if (isVisible) {
      console.log(`Upsell ${upsellId} is not currently available for reservation ${reservationId}`)
      return Response.json(
        { error: 'This upsell is not currently available for your reservation' },
        { status: 403 }
      )
    }

    // Calculate total price based on selection mode
    let totalAmount = 0
    
    if (upsell.isSelectable && selectedItemId) {
      // If selectable, find the selected item price
      const selectedItem = upsell.upsell_items.find(item => item.id === selectedItemId)
      if (!selectedItem) {
        return Response.json(
          { error: 'Selected item not found' },
          { status: 400 }
        )
      }
      totalAmount = selectedItem.price * parsedQuantity
    } else if (!upsell.isSelectable) {
      // If not selectable, calculate total of all items
      const baseTotal = upsell.upsell_items.reduce((sum, item) => sum + item.price, 0)
      totalAmount = baseTotal * parsedQuantity
    } else {
      return Response.json(
        { error: 'No item selected' },
        { status: 400 }
      )
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        upsell_id: upsellId,
        reservation_id: reservationId,
        quantity: parsedQuantity.toString(),
        selected_item_id: selectedItemId || ''
      }
    })
    
    // Log successful payment intent creation
    console.log(`Created payment intent for upsell ${upsellId}, reservation ${reservationId}, amount: ${totalAmount}`)
    
    return Response.json({ 
      clientSecret: paymentIntent.client_secret,
      upsellId,
      reservationId,
      amount: totalAmount
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return Response.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    )
  }
}