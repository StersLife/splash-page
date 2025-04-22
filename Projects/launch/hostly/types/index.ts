export interface Property {
    id: number
    name: string | null
    description: string | null
    created_at: string
    updated_at: string
  }
  export interface Group {
    id: number
    name: string | null
    description: string | null
  }
  
  export interface PropertyGroup {
    id: number
    group_id: number
    quantity: number
    property_id?: number
    created_at?: string
    updated_at?: string
    group: Group
  }

  export interface Checklist {
    id: number
    name: string | null
    title: string
    description: string | null
    completed: boolean
    created_at: string
    updated_at: string
  }


  export interface Task {
    id: number
    name: string | null
    content: string | null
    position: number
    image_required: boolean
  }

  export interface SectionGroup {
    id: number
    group_id: number
    section_id: number
    position: number
    groups: Group
    tasks: Task[]
  }
  export interface Section {
    id: number
    title: string | null
    position: number
    checklist_id: number
    section_groups: SectionGroup[]
  }