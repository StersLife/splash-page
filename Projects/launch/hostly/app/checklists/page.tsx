import Link from 'next/link'
import NewChecklistForm from './NewChecklistForm'
import { createClient } from '@/lib/supabase/server'

 
export default async function ChecklistPage() {
  const supabase = await createClient()
  const { data: checklists, error } = await supabase
    .from('checklists')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return <p className="text-red-600">Error: {error.message}</p>

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <NewChecklistForm />

      <div>
        <h2 className="text-lg font-bold mt-6">All Checklists</h2>
        {checklists.length ? (
          <ul className="space-y-3 mt-4">
            {checklists.map((c) => (
              <li key={c.id} className="border p-3 rounded">
                <Link href={`/checklists/${c.id}`} className="font-semibold text-blue-600 hover:underline">
                  {c.title}
                </Link>
                <p className="text-sm text-gray-600">{c.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No checklists yet.</p>
        )}
      </div>
    </main>
  )
}
