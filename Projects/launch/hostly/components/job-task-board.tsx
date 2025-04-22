'use client';

import { useState } from 'react';

type JobTask = {
  id: number;
  name: string;
  completed: boolean;
};

type JobSectionGroup = {
  id: number;
  name: string;
  job_tasks: JobTask[];
};

type JobSection = {
  id: number;
  title: string;
  job_section_groups: JobSectionGroup[];
};

type Props = {
  jobSections: JobSection[];
};

export default function JobTaskBoard({ jobSections }: Props) {
  const [sections, setSections] = useState(jobSections);

  const handleToggle = async (taskId: number, completed: boolean) => {
    const res = await fetch(`/api/job-tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });

    if (res.ok) {
      setSections(prev =>
        prev.map(section => ({
          ...section,
          job_section_groups: section.job_section_groups.map(group => ({
            ...group,
            job_tasks: group.job_tasks.map(task =>
              task.id === taskId ? { ...task, completed } : task
            ),
          })),
        }))
      );
    }
  };

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.id} className="border p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold">{section.title}</h2>

          {section.job_section_groups.map(group => (
            <div key={group.id} className="ml-4 mt-4">
              <h3 className="font-semibold">{group.name}</h3>

              <ul className="ml-4 mt-2 space-y-1">
                {group.job_tasks.map(task => (
                  <li key={task.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task.id, !task.completed)}
                    />
                    <span className={task.completed ? 'line-through text-gray-400' : ''}>
                      {task.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
