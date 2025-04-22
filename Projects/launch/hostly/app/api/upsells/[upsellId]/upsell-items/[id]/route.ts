import { createClient } from "@/lib/supabase/server";

export async function PUT(
  request: Request,
  { params }: { params: { upsellId: string; id: string } }
) {
  try {
    const { upsellId, id } = params;
    const body = await request.json();
    const { name, description, price } = body;

    // Validate required fields
    if (!name || price === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    // First, verify this item belongs to the specified upsell
    const { data: existingItem, error: checkError } = await supabase
      .from("upsell_items")
      .select("id")
      .eq("id", parseInt(id, 10))
      .eq("upsell_id", parseInt(upsellId, 10))
      .single();

    if (checkError || !existingItem) {
      return Response.json({ error: "Item not found or does not belong to this upsell" }, { status: 404 });
    }

    // Update the item
    const { data: updatedItem, error } = await supabase
      .from("upsell_items")
      .update({
        name,
        description,
        price,
      })
      .eq("id", parseInt(id, 10))
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Return the updated upsell item
    return Response.json(updatedItem, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// Optionally, you can also implement DELETE for this route
export async function DELETE(
  request: Request,
  { params }: { params: { upsellId: string; id: string } }
) {
  try {
    const { upsellId, id } = params;
    const supabase = await createClient();

    // First, verify this item belongs to the specified upsell
    const { data: existingItem, error: checkError } = await supabase
      .from("upsell_items")
      .select("id")
      .eq("id", parseInt(id, 10))
      .eq("upsell_id", parseInt(upsellId, 10))
      .single();

    if (checkError || !existingItem) {
      return Response.json({ error: "Item not found or does not belong to this upsell" }, { status: 404 });
    }

    // Delete the item
    const { error } = await supabase
      .from("upsell_items")
      .delete()
      .eq("id", parseInt(id, 10));

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Return success with no content
    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json({ error: "Failed to delete item" }, { status: 500 });
  }
}