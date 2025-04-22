'use client'

import { Section as SectionType } from '@/types/checklist'
import Section from './section'

type ChecklistBoardProps = {
  sections: SectionType[]
}

const ChecklistBoard = ({ sections }: ChecklistBoardProps) => {
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  )
}

export default ChecklistBoard