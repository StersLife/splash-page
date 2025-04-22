import { createClient } from "@/lib/supabase/server"

 
export async function GET() {
    const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const { name, description } = await req.json()

  if (!name?.trim() || !description?.trim()) {
    return Response.json({ error: 'Both fields are required' }, { status: 400 })
  }
    const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .insert([{ name, description }])
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
