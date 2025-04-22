'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Group } from '@/types'

export default function AddGroupForm({
  propertyId,
  allGroups,
  existingGroupIds
}: {
  propertyId: number
  allGroups: Group[]
  existingGroupIds: number[]
}) {
  const [groupId, setGroupId] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const filteredGroups = allGroups.filter((g) => !existingGroupIds.includes(g.id))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupId || quantity < 1) {
      setError('Select a group and quantity')
      return
    }

    startTransition(async () => {
      const res = await fetch('/api/property-groups', {
        method: 'POST',
        body: JSON.stringify({ property_id: propertyId, group_id: groupId, quantity }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        router.refresh()
      } else {
        const { error } = await res.json()
        setError(error || 'Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4 mt-6">
      <h2 className="font-semibold">Add Group</h2>

      <select
        onChange={(e) => setGroupId(Number(e.target.value))}
        defaultValue=""
        className="w-full border rounded px-3 py-2"
      >
        <option value="" disabled>Select a group</option>
        {filteredGroups.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-full border rounded px-3 py-2"
        placeholder="Quantity"
      />

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {isPending ? 'Adding...' : 'Add Group'}
      </button>
    </form>
  )
}
