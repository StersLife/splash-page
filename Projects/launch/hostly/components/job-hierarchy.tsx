export default function JobHierarchy({ sections }: { sections: any[] }) {
    return (
      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="border rounded p-4 shadow-sm bg-white"
          >
            <h2 className="text-lg font-bold mb-2">📁 {section.title}</h2>
  
            {section.section_groups?.map((section_group: any) => (
              <div key={section_group.id} className="ml-4 mb-3">
                <h3 className="text-sm font-semibold text-blue-700">📂 {section_group.group.name}</h3>
                <ul className="list-disc ml-6">
                  {section_group.tasks?.map((task: any) => (
                    <li key={task.id} className="text-sm">
                      <span className={task.completed ? 'line-through text-green-600' : ''}>
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
  