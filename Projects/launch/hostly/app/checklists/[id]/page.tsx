import { AddSectionModal } from '@/components/checklist-board/add-section-modal'
import ChecklistBoard from '@/components/checklist-board/checklist-board'
import { createClient } from '@/lib/supabase/server'

interface Props {
  params: { id: string }
}

export default async function ChecklistPage({ params }: Props) {
  const supabase = await createClient()
  const checklistId = Number(params.id)

  // Fetch checklist details (optional)
  const { data: checklist } = await supabase
    .from('checklists')
    .select('*')
    .eq('id', checklistId)
    .single()

  // Fetch sections with groups and tasks
  const { data: sections } = await supabase
    .from('sections')
    .select(`
      id,
      title,
      position,
      checklist_id,
      section_groups (
        id,
        group_id,
        section_id,
        position,
        groups:group_id (id, name, description),
        tasks:tasks (
          id,
          name,
          content,
          position,
          image_required
        )
      )
    `)
    .eq('checklist_id', checklistId)
    .order('position', { ascending: true })

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">{checklist?.title}</h1>
       <AddSectionModal checklistId={checklistId} />
       <ChecklistBoard sections={sections} />

    </main>
  )
}
