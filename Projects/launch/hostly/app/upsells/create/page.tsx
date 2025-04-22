'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateUpsellPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    internal_title: '',
    display_title: '',
    description: '',
    type: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
 

    const res = await fetch('/api/upsells', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data?.id) router.push(`/upsells/${data.id}`);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Upsell</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="internal_title"
          value={form.internal_title}
          onChange={handleChange}
          placeholder="Internal Title"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          name="display_title"
          value={form.display_title}
          onChange={handleChange}
          placeholder="Display Title"
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
          rows={4}
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="package">Package</option>
          <option value="checkin">Check-in</option>
          <option value="checkout">Check-out</option>
        </select>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Upsell'}
        </button>
      </form>
    </div>
  );
}