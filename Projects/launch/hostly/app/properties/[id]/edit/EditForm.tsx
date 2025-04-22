'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types'

export default function EditForm({ property }: { property: Property }) {
  const router = useRouter()
  const [name, setName] = useState(property.name || '')
  const [description, setDescription] = useState(property.description || '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !description.trim()) {
      setError('Both fields are required')
      return
    }

    startTransition(async () => {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        router.push('/properties')
      } else {
        const { error } = await res.json()
        setError(error || 'Failed to update property')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Name</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isPending ? 'Updating...' : 'Update'}
      </button>
    </form>
  )
}
