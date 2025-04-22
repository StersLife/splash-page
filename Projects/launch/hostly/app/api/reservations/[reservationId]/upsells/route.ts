// app/api/reservations/[reservationId]/upsells/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { addTimeToDate,  isUpsellVisible } from '@/lib/upsell-utils'
import type { Reservation, UpsellProperty } from '@/lib/upsell-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { reservationId: string } }
) {
  try {
    const { reservationId } = params
    const supabase = await createClient()

    // Parse override timestamp from query string if provided (for testing)
    const url = new URL(request.url)
    const timestampParam = url.searchParams.get('timestamp')
    const currentTime = timestampParam ? new Date(timestampParam) : new Date()

    // Log the timestamp we're using for debugging
    console.log(`API using timestamp: ${currentTime.toISOString()}`)

    // Fetch reservation data
    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single() as { data: Reservation, error: any }

    if (reservationError || !reservation) {
      console.error('Reservation not found:', reservationError)
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      )
    }

    // Log reservation details for debugging
    console.log(`Reservation: ${JSON.stringify({
      id: reservation.id,
      arrival: reservation.arrival_date,
      departure: reservation.departure_date
    })}`)

    // Fetch all upsells for this property
    const { data: upsellProps, error: upsellError } = await supabase
      .from('upsell_properties')
      .select(`
        upsell:upsell_id (
          *,
          upsell_items (*),
          upsell_visibility_rules (*)
        )
      `)
      .eq('property_id', reservation.property_id) as { data: UpsellProperty[], error: any }

    if (upsellError) {
      console.error('Failed to fetch upsells:', upsellError)
      return NextResponse.json(
        { error: 'Failed to fetch upsells' },
        { status: 500 }
      )
    }

    // Log total upsells found before filtering
    console.log(`Found ${upsellProps.length} upsells before filtering`)

    // Filter upsells based on visibility rules with detailed logging
    const visibleUpsells = upsellProps
      .filter(entry => {
        const upsell = entry.upsell
        const rules = upsell.upsell_visibility_rules || []
        
        // If there are no rules, the upsell is always visible
        if (rules.length === 0) {
          console.log(`Upsell ${upsell.id} has no rules, will be visible`)
          return true
        }
        
        // Log all rules for this upsell
        console.log(`Evaluating ${rules.length} rules for upsell ${upsell.id}:`, 
          rules.map(r => `${r.rule_type} ${r.value} ${r.unit}`))
        
        const arrivalDate = new Date(reservation.arrival_date)
        const departureDate = new Date(reservation.departure_date)
        
        // Check each rule - if ANY rule matches, the upsell should be visible (OR logic)
        const isVisible = rules.some(rule => {
          let result = false
          switch (rule.rule_type) {
            case 'Before Check-in': {
              // Upsell is visible if current time is before check-in by the specified amount
              const visibilityWindow = addTimeToDate(arrivalDate, -rule.value, rule.unit)
              result = currentTime <= arrivalDate && currentTime >= visibilityWindow
              console.log(`Rule ${rule.rule_type} ${rule.value} ${rule.unit}:`, 
                `currentTime(${currentTime.toISOString()}) <= arrivalDate(${arrivalDate.toISOString()}) && ` +
                `currentTime >= visibilityWindow(${visibilityWindow.toISOString()}) = ${result}`)
              break
            }
            case 'After Check-in': {
              // Upsell is visible if current time is after check-in by the specified amount
              const visibilityWindow = addTimeToDate(arrivalDate, rule.value, rule.unit)
              result = currentTime >= arrivalDate && currentTime <= visibilityWindow
              console.log(`Rule ${rule.rule_type} ${rule.value} ${rule.unit}:`, 
                `currentTime(${currentTime.toISOString()}) >= arrivalDate(${arrivalDate.toISOString()}) && ` +
                `currentTime <= visibilityWindow(${visibilityWindow.toISOString()}) = ${result}`)
              break
            }
            case 'Before Checkout': {
              // Upsell is visible if current time is before checkout by the specified amount
              const visibilityWindow = addTimeToDate(departureDate, -rule.value, rule.unit)
              result = currentTime <= departureDate && currentTime >= visibilityWindow
              console.log(`Rule ${rule.rule_type} ${rule.value} ${rule.unit}:`, 
                `currentTime(${currentTime.toISOString()}) <= departureDate(${departureDate.toISOString()}) && ` +
                `currentTime >= visibilityWindow(${visibilityWindow.toISOString()}) = ${result}`)
              break
            }
          }
          return result
        })
        
        console.log(`Upsell ${upsell.id} visibility result: ${isVisible}`)
        return isVisible
      })
      .map(entry => entry.upsell)

    console.log(`Found ${visibleUpsells.length} visible upsells after filtering`)

    return NextResponse.json({ 
      upsells: visibleUpsells,
      reservation,
      timestamp: currentTime.toISOString()
    })
  } catch (error) {
    console.error('Error fetching upsells:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}