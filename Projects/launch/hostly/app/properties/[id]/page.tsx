import { createClient } from '@/lib/supabase/server'
import AddGroupForm from './AddGroupForm'
import DeleteGroupButton from './DeleteGroupButton'

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const propertyId = Number(params.id)
    const supabase = await createClient()

  const { data: groups } = await supabase
    .from('property_groups')
    .select('id, group_id, quantity, group:groups(*)')
    .eq('property_id', propertyId)

  const { data: allGroups } = await supabase.from('groups').select('*')
  

        if (!allGroups) {
            return <div className="p-6 text-red-600">Error fetching groups</div>
        }
        if (!groups) {
            return <div className="p-6 text-red-600">Error fetching property groups</div>
        }
 

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold mb-2">Property Groups</h1>

      {groups?.length ? (
        <ul className="space-y-3">
          {groups.map((pg) => (
            <li key={pg.id} className="border p-3 rounded">
              <div className="font-semibold">{pg.group.name}</div>
              <div className="text-sm text-gray-600">{pg.group.description}</div>
              <div className="text-xs mt-1">Quantity: {pg.quantity}</div>
              <DeleteGroupButton id={pg.id} />

            </li>
          ))}
        </ul>
      ) : (
        <p>No groups added yet.</p>
      )}

      <AddGroupForm propertyId={propertyId} allGroups={allGroups} existingGroupIds={groups?.map(pg => pg.group_id) || []} />
    </main>
  )
}
