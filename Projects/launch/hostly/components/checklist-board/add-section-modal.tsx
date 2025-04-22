'use client'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function AddSectionModal({ checklistId }: { checklistId: number }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleAddSection() {
    if (!title.trim()) return

    startTransition(async () => {
      const res = await fetch('/api/sections', {
        method: 'POST',
        body: JSON.stringify({ title, checklist_id: checklistId }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        setTitle('')
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">+ Add Section</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Section</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Section title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleAddSection} disabled={isPending}>
            {isPending ? 'Adding...' : 'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
