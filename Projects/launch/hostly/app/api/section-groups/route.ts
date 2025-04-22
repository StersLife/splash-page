import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()
  const { section_id, group_id } = body

  if (!section_id || !group_id) {
    return Response.json({ error: 'Missing section_id or group_id' }, { status: 400 })
  }

  // Fetch max position for this section
  const { data: existing, error: fetchError } = await supabase
    .from('section_groups')
    .select('position')
    .eq('section_id', section_id)
    .order('position', { ascending: false })
    .limit(1)

  if (fetchError) {
    return Response.json({ error: fetchError.message }, { status: 500 })
  }

  const lastPosition = existing?.[0]?.position ?? 0
  const newPosition = lastPosition + 1024

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('section_groups')
    .insert([
      {
        section_id,
        group_id,
        position: newPosition,
        created_at: now,
        updated_at: now
      }
    ])
    .select()
    .single()

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
