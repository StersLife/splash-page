'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  properties: { id: number; name: string }[];
  checklists: { id: number; title: string }[];
};

export default function CreateJobForm({ properties, checklists }: Props) {
  const router = useRouter();
  const [propertyId, setPropertyId] = useState('');
  const [checklistId, setChecklistId] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: Number(propertyId),
        checklist_id: checklistId ? Number(checklistId) : null,
        date,
      }),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrorMsg(result.error || 'Something went wrong');
    } else {
      router.push('/jobs');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium">Select Property</label>
        <select
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select a property --</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Select Checklist</label>
        <select
          value={checklistId}
          onChange={(e) => setChecklistId(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Optional --</option>
          {checklists.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Job'}
      </button>
    </form>
  );
}
