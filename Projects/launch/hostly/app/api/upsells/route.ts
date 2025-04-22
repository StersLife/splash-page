import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();

  // Start a transaction for creating both upsell and its items
  const { data: upsell, error: upsellError } = await supabase
    .from('upsells')
    .insert({
      internal_title: body.internal_title,
      display_title: body.display_title,
      description: body.description,
      upsell_type: body.type,
      allow_quantity:  (body.type === 'checkin' || body.type === 'checkout') ? false : true,
      is_selectable: (body.type === 'checkin' || body.type === 'checkout') ? true : false
    })
    .select()
    .single();

  if (upsellError) {
    return Response.json({ error: upsellError.message }, { status: 400 });
  }

  // Create appropriate upsell items based on the type
  const upsellItems = [];
  
  if (body.type === 'checkin') {
    // Early check-in upsell items
    upsellItems.push(
      {
        upsell_id: upsell.id,
        name: "1 hour early check-in",
        description: "Check in one hour before the standard check-in time",
        price: 30.00,
      },
      {
        upsell_id: upsell.id,
        name: "2 hours early check-in",
        description: "Check in two hours before the standard check-in time",
        price: 50.00,
      },
      {
        upsell_id: upsell.id,
        name: "3 hours early check-in",
        description: "Check in three hours before the standard check-in time",
        price: 65.00,
      },
      {
        upsell_id: upsell.id,
        name: "4 hours early check-in",
        description: "Check in four hours before the standard check-in time",
        price: 80.00,
      }
    );
  } else if (body.type === 'checkout') {
    // Late check-out upsell items
    upsellItems.push(
      {
        upsell_id: upsell.id,
        name: "1 hour late check-out",
        description: "Check out one hour after the standard check-out time",
        price: 30.00,
      },
      {
        upsell_id: upsell.id,
        name: "2 hours late check-out",
        description: "Check out two hours after the standard check-out time",
        price: 50.00,
      },
      {
        upsell_id: upsell.id,
        name: "3 hours late check-out",
        description: "Check out three hours after the standard check-out time",
        price: 65.00,
      },
      {
        upsell_id: upsell.id,
        name: "4 hours late check-out",
        description: "Check out four hours after the standard check-out time",
        price: 80.00,
      }
    );
  }

  // Insert the upsell items
  const { data: items, error: itemsError } = await supabase
    .from('upsell_items')
    .insert(upsellItems)
    .select();

  if (itemsError) {
    return Response.json({ 
      error: `Upsell created but failed to create items: ${itemsError.message}` 
    }, { status: 400 });
  }


  if(body.type === 'checkin' || body.type === 'checkout') {
    let rule_type =  body.type === 'checkin' ? 'before checkin' : 'after checkout';
  
    // Create visibility rules for the upsell
    const { error: rulesError } = await supabase
      .from('upsell_visibility_rules')
      .insert({
        upsell_id: upsell.id,
        rule_type,
        unit: 'hours',
        value: 24,
      });
    if (rulesError) {
      return Response.json({
        error: `Upsell created but failed to create visibility rules: ${rulesError.message}`
      }, { status: 400 });
    }
  }

  // Return both the upsell and its items
  return Response.json({
    upsell,
    items,
    id: upsell.id,
  });
}