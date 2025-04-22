'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function NewChecklistForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    startTransition(async () => {
      const res = await fetch('/api/checklists', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        setName('')
        setDescription('')
        router.refresh()
      } else {
        const { error } = await res.json()
        setError(error || 'Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-semibold text-lg">Create New Checklist</h2>
      <input
        className="w-full border px-3 py-2 rounded"
        placeholder="Name (required)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="w-full border px-3 py-2 rounded"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? 'Creating...' : 'Create Checklist'}
      </button>
    </form>
  )
}
