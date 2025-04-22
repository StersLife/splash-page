import { createClient } from '@/lib/supabase/server'
import EditForm from './EditForm'

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
 const supabase = await createClient()
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !property) {
    return <div className="p-6 text-red-600">Property not found</div>
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit Property</h1>
      <EditForm property={property} />
    </main>
  )
}
