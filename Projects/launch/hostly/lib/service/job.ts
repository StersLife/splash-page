import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export async function getJob(jobId: number) {
  const supabase = await createClient()

  // Fetch job
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('id, property_id, checklist_id, date, snapshot_at')
    .eq('id', jobId)
    .single()

  if (jobError) {
    throw new Error(`Error fetching job: ${jobError.message}`)
  }

  if (!job) {
    notFound()
  }

  // If job is a snapshot, just fetch jobSections directly
  if (job.snapshot_at) {
    const sections = await fetchJobSections(job.id)
    return { job, sections }
  }

  // Else, fetch property groups for normalization
  const { data: propertyGroups, error: pgError } = await supabase
    .from('property_groups')
    .select('group_id, quantity')
    .eq('property_id', job.property_id)

  if (pgError) {
    throw new Error(`Error fetching property groups: ${pgError.message}`)
  }

  const propertyGroupMap = new Map<number, number>()
  propertyGroups?.forEach(pg => {
    propertyGroupMap.set(pg.group_id, pg.quantity || 1)
  })

  const sections = await fetchChecklistSections(job.checklist_id, propertyGroupMap)

  return {
    job,
    sections,
  }
}

async function fetchChecklistSections(checklist_id: number, propertyGroupMap: Map<number, number>) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('sections')
    .select(`
      id, title, position,
      section_groups (
        id, group_id, position,
        group:group_id (
          id, name
        ),
        tasks (
          id, name, completed, position
        )
      )
    `)
    .eq('checklist_id', checklist_id)
    .order('position', { ascending: true })

  if (error) {
    throw new Error(`Error fetching checklist sections: ${error.message}`)
  }

  return data.map(section => {
    const validGroups = section.section_groups
      .filter(sg => propertyGroupMap.has(sg.group_id))
      .flatMap(sg => {
        const quantity = propertyGroupMap.get(sg.group_id) || 1
        return Array.from({ length: quantity }, (_, i) => ({
          ...sg,
          id: `${sg.id}-${i + 1}`,
          instance: i + 1,
        }))
      })

    return {
      ...section,
      section_groups: validGroups,
    }
  })
}

async function fetchJobSections(jobId: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('job_sections')
    .select(`
      id, title, position,
      job_section_groups (
        id, group_id, name, position,
        job_tasks (
          id, name, completed, position
        )
      )
    `)
    .eq('job_id', jobId)
    .order('position', { ascending: true })

  if (error) {
    throw new Error(`Error fetching job sections: ${error.message}`)
  }

  return data
}
