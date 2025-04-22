// /types/checklist.ts

export type Task = {
    id: number
    name: string
    content: string | null
    position: number
    image_required: boolean
  }
  
  export type SectionGroup = {
    id: number
    section_id: number
    group_id: number
    position: number
    groups: {
      id: number
      name: string
      description: string | null
    }
    tasks: Task[]
  }
  
  export type Section = {
    id: number
    title: string
    position: number
    checklist_id: number
    section_groups: SectionGroup[]
  }