import { createClient } from "@/lib/supabase/server"


export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('checklists')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const { name, description } = await req.json()

  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('checklists')
    .insert([{ name, title: name, description, created_at: now, updated_at: now }])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
