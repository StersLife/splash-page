// app/upsell/[upsellId]/upsell-items/route.ts

import { createClient } from "@/lib/supabase/server";

export async function POST(
    request: Request,
    { params }: { params: { upsellId: string } }
) {
    try {
        const { upsellId } = params;
        const body = await request.json();
        const { name, description, price } = body;

        // Validate required fields
        if (!name || price === undefined) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = await createClient();

        const { data: newItem, error } = await supabase
            .from("upsell_items")
            .insert({
                name,
                description,
                price,
                upsell_id: parseInt(upsellId, 10), // Ensure upsellId is an integer
            })
            .select()
            .single();

        if (error) {
            return Response.json({ error: error.message }, { status: 500 });
        }

        // Return the newly created upsell item
        return Response.json(newItem, { status: 201 });
    } catch (error) {
        return Response.json({ error: "Failed to create item" }, { status: 500 });
    }
}
