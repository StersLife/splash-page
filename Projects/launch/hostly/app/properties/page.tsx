 import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PropertiesPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Properties</h1>
      <Link href="/properties/new" className="text-blue-600 underline">
        Add New Property
      </Link>
      <ul className="mt-4 space-y-2">
        {properties?.map((p) => (
          <li key={p.id} className="border p-4 rounded">
            <div className="font-semibold">{p.name}</div>
            <p className="text-gray-600">{p.description}</p>
            <Link
              href={`/properties/${p.id}/edit`}
              className="text-blue-500 text-sm underline mt-2 inline-block"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
