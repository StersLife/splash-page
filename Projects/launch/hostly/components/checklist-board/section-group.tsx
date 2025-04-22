'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Sortable from 'sortablejs'
import { SectionGroup as SectionGroupType, Task } from '@/types/checklist'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import TaskItem from './task-item'

const SectionGroup = ({ group }: { group: SectionGroupType }) => {
  const taskListRef = useRef<HTMLDivElement | null>(null)
  const [newTaskName, setNewTaskName] = useState('')
  const [imageRequired, setImageRequired] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    if (taskListRef.current) {
      Sortable.create(taskListRef.current, {
        group: 'tasks',
        animation: 150,
        draggable: '.task',
        onEnd: (e) => {
          console.log('Task moved', e)
        },
      })
    }
  }, [])

  async function handleAddTask() {
    if (!newTaskName.trim()) return

    startTransition(async () => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          name: newTaskName,
          section_group_id: group.id,
          image_required: imageRequired
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        setNewTaskName('')
        setImageRequired(false)
        router.refresh()
      } else {
        alert('Error creating task')
      }
    })
  }

  return (
    <div className="section-group bg-white rounded shadow p-3 flex flex-col">
      <h4 className="font-medium mb-1">{group.groups.name}</h4>
      {group.groups.description && (
        <p className="text-sm text-gray-500 mb-2">{group.groups.description}</p>
      )}
      <div ref={taskListRef} className="flex flex-col gap-2">
        {group.tasks.map((task: Task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <Input
          placeholder="New task name..."
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Checkbox
            checked={imageRequired}
            onCheckedChange={(val) => setImageRequired(!!val)}
            id={`image-toggle-${group.id}`}
          />
          <Label htmlFor={`image-toggle-${group.id}`}>Image Required</Label>
        </div>
        <Button
          onClick={handleAddTask}
          disabled={!newTaskName || isPending}
          className="w-full"
        >
          {isPending ? 'Saving...' : 'Add Task'}
        </Button>
      </div>
    </div>
  )
}

export default SectionGroup