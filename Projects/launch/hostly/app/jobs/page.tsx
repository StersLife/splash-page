// app/jobs/page.tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('id, date, status')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading jobs: {error.message}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <Link href="/jobs/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">+ Create Job</button>
        </Link>
      </div>
      {jobs?.length ? (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block">
            <li key={job.id} className="border p-4 rounded">
              <p><strong>ID:</strong> {job.id}</p>
              <p><strong>Date:</strong> {job.date}</p>
              <p><strong>Status:</strong> {job.status}</p>
            </li>
            </Link>
          ))}
        </ul>
      ) : (
        <p>No jobs found.</p>
      )}
    </div>
  );
}
