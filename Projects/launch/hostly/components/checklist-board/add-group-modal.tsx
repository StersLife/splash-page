'use client'
import { useEffect, useState, useTransition } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export function AddGroupModal({ sectionId }: { sectionId: number }) {
  const [open, setOpen] = useState(false)
  const [existingGroups, setExistingGroups] = useState<{ id: number; name: string }[]>([])
  const [createNew, setCreateNew] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [newGroup, setNewGroup] = useState({ name: '', description: '' })
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/groups')
      .then((res) => res.json())
      .then((data) => setExistingGroups(data || []))
  }, [])

  async function handleSubmit() {
    startTransition(async () => {
      let groupId = selectedGroup

      if (createNew) {
        const groupRes = await fetch('/api/groups', {
          method: 'POST',
          body: JSON.stringify(newGroup),
          headers: { 'Content-Type': 'application/json' }
        })
        const groupData = await groupRes.json()
        groupId = groupData.id
      }

      if (!groupId) return

      await fetch('/api/section-groups', {
        method: 'POST',
        body: JSON.stringify({ section_id: sectionId, group_id: groupId }),
        headers: { 'Content-Type': 'application/json' }
      })

      setOpen(false)
      setNewGroup({ name: '', description: '' })
      setSelectedGroup(null)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-sm text-blue-600 hover:underline">+ Add Group</button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Add Group to Section</DialogTitle>
        </DialogHeader>
        {!createNew ? (
          <div>
            <Label>Select Existing Group</Label>
            <select
              className="w-full mt-1 border rounded px-3 py-2"
              onChange={(e) => setSelectedGroup(Number(e.target.value))}
              value={selectedGroup ?? ''}
            >
              <option value="">-- Select --</option>
              {existingGroups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <button onClick={() => setCreateNew(true)} className="mt-2 text-xs text-blue-600 hover:underline">
              Or create a new group
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input value={newGroup.name} onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={newGroup.description} onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} />
            </div>
            <button onClick={() => setCreateNew(false)} className="text-xs text-blue-600 hover:underline">
              Back to existing groups
            </button>
          </div>
        )}

        <DialogFooter>
          <Button disabled={isPending || (!selectedGroup && !createNew)} onClick={handleSubmit}>
            {isPending ? 'Saving...' : 'Add Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
