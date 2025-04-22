// app/api/upsells/[upsellId]/upsell-visibility-rules/route.ts
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { upsellId: string } }
) {
  try {
    const { upsellId } = params;

    // Ensure the upsell id is provided.
    if (!upsellId) {
      return Response.json({ error: "Missing upsell id" }, { status: 400 });
    }

    const body = await request.json();
    const { rule_type, value, unit } = body;

    // Validate required fields.
    if (!rule_type || value === undefined || !unit) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Convert upsellId to a number and store in a separate variable
    const numericUpsellId = parseInt(upsellId, 10);

    const { data: newRule, error } = await supabase
      .from("upsell_visibility_rules")
      .insert({
        rule_type,
        value: parseInt(value, 10),
        unit,
        upsell_id: numericUpsellId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating visibility rule:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(newRule, { status: 201 });
  } catch (error) {
    console.error("Error creating visibility rule:", error);
    return Response.json(
      { error: "Failed to create visibility rule" },
      { status: 500 }
    );
  }
}
