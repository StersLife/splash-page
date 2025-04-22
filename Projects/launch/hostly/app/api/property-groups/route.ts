import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
    const supabase = await createClient()
  const { property_id, group_id, quantity } = await req.json()

  if (!property_id || !group_id || !quantity) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  // check for duplicate
  const { data: existing } = await supabase
    .from('property_groups')
    .select('*')
    .eq('property_id', property_id)
    .eq('group_id', group_id)
    .maybeSingle()

  if (existing) {
    return Response.json({ error: 'Group already added to property' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('property_groups')
    .insert([{ property_id, group_id, quantity }])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
