// app/api/jobs/route.ts

import { createClient } from "@/lib/supabase/server"

 
export async function POST(req: Request) {

  const { property_id, checklist_id, date } = await req.json()
  if (!property_id || !checklist_id || !date) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const supabase = await createClient()


  const { data, error } = await supabase.from('jobs')
    .insert([{ property_id, checklist_id: checklist_id || null , date }])
    .select()
    .single()
    
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
