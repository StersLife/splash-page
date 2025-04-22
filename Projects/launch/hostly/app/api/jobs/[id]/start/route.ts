import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const jobId = Number(params.id)
  const supabase = await createClient()

  const { error } = await supabase.rpc('start_job', {
    job_id_input: jobId
  })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true })
}
