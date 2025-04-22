
'use client'

import { useEffect, useRef } from 'react'
import Sortable from 'sortablejs'
import { Section as SectionType } from '@/types/checklist'
import SectionGroup from './section-group'
import { AddGroupModal } from './add-group-modal'

const Section = ({ section }: { section: SectionType }) => {
  const groupContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (groupContainerRef.current) {
      Sortable.create(groupContainerRef.current, {
        group: 'section-groups',
        animation: 150,
        draggable: '.section-group',
        onEnd: (e) => {
          console.log('SectionGroup moved', e)
        },
      })
    }
  }, [])

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{section.title}</h2>
        <AddGroupModal sectionId={section.id} />
      </div>
      <div ref={groupContainerRef} className="space-y-4">
        {section.section_groups?.map((group) => (
          <SectionGroup key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}

export default Section