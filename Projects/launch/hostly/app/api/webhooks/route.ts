// app/api/webhooks/route.js
import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import Cors from 'micro-cors';
 

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const cors = Cors({
  allowMethods: ["POST", "HEAD"],
});
export async function POST(request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  console.log({
    body,
    sig,
    endpointSecret,
  })

  let event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event based on its type
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error(`Error processing event ${event.type}: ${error.message}`);
    // Continue processing despite errors in event handling
  }

  // Return a successful response to Stripe
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Handles successful payment intents by creating upsell purchase records
 * @param {Object} paymentIntent - The payment intent object from Stripe
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {

  try {
    console.log('Processing payment intent:', paymentIntent.id);
    const supabase = await createClient();  
    // Extract the relevant metadata from the payment intent
    // Assuming the metadata contains upsell information like upsell_id and selected items
    const metadata = paymentIntent.metadata || {};
    
    // If there's no upsell information in the metadata, we can't proceed
    if (!metadata.upsell_id) {
      console.log('No upsell information found in payment intent metadata');
      return;
    }
    
    const upsellId = parseInt(metadata.upsell_id);
    if (isNaN(upsellId)) {
      console.error(`Invalid upsell_id in metadata: ${metadata.upsell_id}`);
      return;
    }
    
    // Fetch the upsell and its items in a single query
    const { data: upsell, error: upsellError } = await supabase
      .from('upsells')
      .select(`
        *,
        upsell_items (*)
      `)
      .eq('id', upsellId)
      .single();
    
    if (upsellError || !upsell) {
      console.error(`Error fetching upsell: ${upsellError?.message || 'Upsell not found'}`);
      return;
    }
    
    // Check if we have upsell items
    const upsellItems = upsell.upsell_items;
    if (!upsellItems?.length) {
      console.error('No upsell items found');
      return;
    }
    
    // Parse the selected items from metadata
    // Assuming the metadata contains item IDs and quantities in the format:
    // selected_items: '1:2,3:1' where 1 and 3 are item IDs and 2 and 1 are quantities
    const selectedItems = metadata.selected_items ? 
      parseSelectedItems(metadata.selected_items) : 
      {};
    
    // Create the upsell purchase record
    const { data: upsellPurchase, error: purchaseError } = await supabase
      .from('upsell_purchases')
      .insert({
        upsell_id: upsellId,
        status: upsell.requires_approval ? 'pending_approval' : 'approved',
      })
      .select()
      .single();
    
    if (purchaseError || !upsellPurchase) {
      console.error(`Error creating upsell purchase: ${purchaseError?.message}`);
      return;
    }
    
    // Create purchase item records for each selected item
    const purchaseItemsToInsert = [];
    
    for (const upsellItem of upsellItems) {
      // If the item is in the selected items or if we don't have specific selections
      // (in which case we assume all items were purchased)
      if (Object.keys(selectedItems).length === 0 || selectedItems[upsellItem.id]) {
        const quantity = selectedItems[upsellItem.id] || 1;
        
        purchaseItemsToInsert.push({
          upsell_purchase_id: upsellPurchase.id,
          upsell_item_id: upsellItem.id,
          quantity: quantity,
          purchase_price: upsellItem.price, // Storing the price at the time of purchase
        });
      }
    }
    
    // Validate that we have items to insert
    if (purchaseItemsToInsert.length === 0) {
      console.warn(`No items to purchase for upsell purchase #${upsellPurchase.id}`);
      
      // Clean up the empty purchase record
      const { error: deleteError } = await supabase
        .from('upsell_purchases')
        .delete()
        .eq('id', upsellPurchase.id);
        
      if (deleteError) {
        console.error(`Error deleting empty upsell purchase: ${deleteError.message}`);
      }
      
      return;
    }
    
    // Insert all purchase items
    const { data: insertedItems, error: insertError } = await supabase
      .from('purchase_items')
      .insert(purchaseItemsToInsert)
      .select();
    
    if (insertError) {
      console.error(`Error creating purchase items: ${insertError.message}`);
      return;
    }
    
    console.log(
      `Successfully created upsell purchase #${upsellPurchase.id} with ${purchaseItemsToInsert.length} items`,
      `(Payment Intent: ${paymentIntent.id})`
    );
    
  } catch (error) {
    console.error(`Error in handlePaymentIntentSucceeded: ${error.message}`);
  }
};

/**
 * Parse the selected items string from metadata
 * @param {string} selectedItemsStr - Format: "itemId:quantity,itemId:quantity"
 * @returns {Object} - Map of item IDs to quantities
 */
const parseSelectedItems = (selectedItemsStr:any) => {
  const result = {};
  if (!selectedItemsStr) return result;
  
  selectedItemsStr.split(',').forEach(item => {
    const [itemId, quantity] = item.split(':');
    if (itemId && quantity) {
      result[parseInt(itemId)] = parseInt(quantity);
    }
  });
  
  return result;
};