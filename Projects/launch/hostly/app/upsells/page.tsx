import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function UpsellListPage() {
  const supabase = await createClient();
  const { data: upsells } = await supabase.from('upsells').select('*').order('display_order');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Upsells</h1>
        <Link href="/upsells/create" className="bg-blue-600 text-white px-4 py-2 rounded">Create Upsell</Link>
      </div>
      <ul className="space-y-4">
        {upsells?.map((upsell) => (
          <li key={upsell.id} className="border p-4 rounded shadow">
            <Link href={`/upsells/${upsell.id}`} className="text-lg font-medium hover:underline">
              {upsell.display_title || upsell.internal_title}
            </Link>
            <p className="text-gray-600">{upsell.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}