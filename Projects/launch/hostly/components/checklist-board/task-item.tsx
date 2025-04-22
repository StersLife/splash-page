'use client'

import { Task } from '@/types/checklist'

const TaskItem = ({ task }: { task: Task }) => {
  return (
    <div className="task bg-gray-200 px-2 py-1 rounded text-sm">
      {task.name}
    </div>
  )
}

export default TaskItem