import { createClient } from "@/lib/supabase/server"

 
export async function GET(_: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 404 })
  return Response.json(data)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { name, description } = await req.json()

  if (!name?.trim() || !description?.trim()) {
    return Response.json({ error: 'Both fields are required' }, { status: 400 })
  }
    const supabase = await createClient()

  const { data, error } = await supabase
    .from('properties')
    .update({
      name,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
