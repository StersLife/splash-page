import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
    const supabase = await createClient()
  const { title, checklist_id, position } = await req.json()

  if (!title || !checklist_id) {
    return Response.json({ error: 'Missing title or checklist_id' }, { status: 400 })
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('sections')
    .insert([{ title, checklist_id, position, created_at: now, updated_at: now }])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
