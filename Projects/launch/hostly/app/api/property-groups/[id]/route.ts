import { createClient } from "@/lib/supabase/server"

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient()
    

    const { error } = await supabase.from('property_groups').delete().eq('id', params.id)
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ success: true })
  }