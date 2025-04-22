import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
    const supabase = await createClient()
    const { name, section_group_id, image_required = false } = await req.json()

    if (!name || !section_group_id) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase.from('tasks').insert({
    name,
    section_group_id,
    image_required,
    completed: false,
    created_at: now,
    updated_at: now
  }).select('*').single()
  
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
