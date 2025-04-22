
// app/upsells/[id]/page.tsx - Details Page (Server Component)
import UpsellItems from '@/components/upsell/upsell-items';
import UpsellPropertiesSelector from '@/components/upsell/upsell-properties-selector';
import UpsellVisibilityRules from '@/components/upsell/upsell-visibility-rules';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
}

 
export default async function UpsellDetailsPage({ params }: Props) {
  const supabase = await createClient();

  const { data: upsell } = await supabase
  .from('upsells')
  .select(`
    *,
    upsell_items (*),
    upsell_visibility_rules (*),
    upsell_properties (*)
  `)
  .eq('id', params.id)
  .single();  if (!upsell) return notFound();

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
  if (!properties) return notFound();

 
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{upsell.display_title || upsell.internal_title}</h1>
      <p className="mb-4 text-gray-600">{upsell.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold">Upsell Items</h2>
          <ul className="list-disc list-inside">
           <UpsellItems items={upsell.upsell_items} />
          </ul>
        </div>

        <div>
 
          <ul className="list-disc list-inside">
            <UpsellVisibilityRules rules={upsell.upsell_visibility_rules} />
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold">Linked Properties</h2>
           <UpsellPropertiesSelector
            properties={properties}
            upsellId={params.id}
            initialSelected={upsell.upsell_properties.map((property: any) => property.property_id)}
          />
        </div>
      </div>
    </div>
  );
}
