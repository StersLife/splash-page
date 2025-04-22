import JobHierarchy from '@/components/job-hierarchy'
import { StartButton } from './../start-button'
import { getJob } from '@/lib/service/job'
import JobTaskBoard from '@/components/job-task-board'

type PageProps = {
  params: { id: string }
}

export default async function Page({ params }: PageProps) {
  const jobId = Number(params.id)
  const {job, sections} = await getJob(jobId)

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🛠 Job Structure</h1>

      {
        !job.snapshot_at ? (
          <>
          <div className='flex justify-center mb-4'>
            <StartButton jobId={jobId} />
          </div>
          <JobHierarchy sections={sections ?? []} />
          </>
        ) :  <JobTaskBoard jobSections={sections} />
      }


    </main>
  )
}
