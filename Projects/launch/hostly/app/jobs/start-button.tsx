'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function StartButton({ jobId }: { jobId: number }) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)

    const res = await fetch(`/api/jobs/${jobId}/start`, {
      method: 'POST'
    })

    if (res.ok) {
      const data = await res.json()
      console.log('Job started:', data)
    } else {
      console.error('Failed to start job')
    }

    setLoading(false)
  }

  return (
    <Button onClick={handleClick} size="lg" disabled={loading}>
      {loading ? 'Starting...' : 'Start'}
    </Button>
  )
}
