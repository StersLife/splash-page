'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function DeleteGroupButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to remove this group from the property?')
    if (!confirmed) return

    startTransition(async () => {
      const res = await fetch(`/api/property-groups/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete group.')
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 text-sm hover:underline"
    >
      {isPending ? 'Removing...' : 'Remove'}
    </button>
  )
}
