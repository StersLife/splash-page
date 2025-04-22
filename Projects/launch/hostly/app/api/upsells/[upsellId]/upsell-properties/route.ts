// app/api/upsells/[upsellId]/upsell-properties/route.ts
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { upsellId: string } }
) {
  try {
    const { upsellId } = params;

    if (!upsellId) {
      return Response.json({ error: "Missing upsell id" }, { status: 400 });
    }

    const body = await request.json();
    const { propertyIds } = body;

    if (!Array.isArray(propertyIds)) {
      return Response.json(
        { error: "propertyIds must be an array" },
        { status: 400 }
      );
    }

    // Convert upsellId to a numeric value.
    const numericUpsellId = parseInt(upsellId, 10);
    const supabase = await createClient();

    // Delete existing upsell_properties records for this upsell.
    const { error: deleteError } = await supabase
      .from("upsell_properties")
      .delete()
      .eq("upsell_id", numericUpsellId);

    if (deleteError) {
      console.error("Error deleting existing upsell properties:", deleteError);
      return Response.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    // If no propertyIds are selected, simply return a success response.
    if (propertyIds.length === 0) {
      return Response.json(
        { message: "Upsell properties updated successfully", properties: [] },
        { status: 200 }
      );
    }

    // Build the array of records to insert.
    const records = propertyIds.map((pid: number) => ({
      upsell_id: numericUpsellId,
      property_id: pid,
    }));

    // Insert new records.
    const { data: newRecords, error: insertError } = await supabase
      .from("upsell_properties")
      .insert(records)
      .select();

    if (insertError) {
      console.error("Error inserting new upsell properties:", insertError);
      return Response.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Upsell properties updated successfully", properties: newRecords },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating upsell properties:", error);
    return Response.json(
      { error: "Failed to update upsell properties" },
      { status: 500 }
    );
  }
}
