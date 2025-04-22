// app/api/job-tasks/[id]/route.ts
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const taskId = parseInt(params.id, 10);
  const body = await req.json();
  const { completed } = body;
  const supabase = await createClient();
  const {error} =  await supabase
    .from('job_tasks')
    .update({ completed })
    .eq('id', taskId);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

  return Response.json({ success: true });
}
