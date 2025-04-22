// app/jobs/create/page.tsx
import { createClient } from '@/lib/supabase/server';
import CreateJobForm from './create-job-form';

export default async function CreateJobPage() {
  const supabase =  await createClient();
  const { data: properties } = await supabase
    .from('properties')
    .select('id, name')
    .order('name');

  const { data: checklists } = await supabase
    .from('checklists')
    .select('id, title')
    .order('title');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Create Job</h1>
      <CreateJobForm properties={properties || []} checklists={checklists || []} />
    </div>
  );
}
