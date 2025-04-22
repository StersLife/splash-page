// app/reservations/[id]/page.tsx or similar
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: { id: string }
}

export default async function ReservationPage({ params }: Props) {
  const { id } = params
  const supabase  = await createClient()

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !reservation) {
    console.error(error)
    notFound()
  }

  const { data: upsells, error: upsellError } = await supabase
  .from('upsell_properties')
  .select(`
    upsell:upsell_id (
      *,
      upsell_items (*),
      upsell_visibility_rules (*)
    )
    
    
  `)
  .eq('property_id', reservation.property_id)
  if (upsellError) {
    console.error(upsellError)
    notFound()
  }


  return (
    <div>
      <h1>Reservation Details</h1>
      <pre>
        <code>{JSON.stringify(upsells, null, 2)}</code>
      </pre>
      <div className="border rounded p-4 bg-gray-50">
        <div className="font-semibold text-sm text-gray-800 mb-2">
          Reservation ID: {reservation.id}
        </div>
        <div className="text-sm text-gray-700">
          Property ID: {reservation.property_id}
        </div>
    </div>
 

<div className="space-y-4">
      {upsells.map((entry) => {
        const upsell = entry.upsell
        const items = upsell.upsell_items || []
        const total = items.reduce((sum, item) => sum + item.price, 0)

        return (
            <Link 
              key={upsell.id}
              href={`/reservations/${id}/upsells/${upsell.id}`}
              className="block p-4 border rounded bg-gray-50 hover:bg-gray-100 transition"
            >
          <div key={upsell.id} className="border rounded p-4 bg-gray-50">
            <div className="font-semibold text-sm text-gray-800 mb-2">
              {upsell.display_title || upsell.internal_title}
            </div>

            <ul className="space-y-1 text-sm text-gray-700">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    {item.description && (
                      <span className="text-gray-500 text-xs block">
                        {item.description}
                      </span>
                    )}
                  </div>
                  <div className="text-right font-medium">${item.price.toLocaleString()}</div>
                </li>
              ))}
            </ul>

            <div className="border-t mt-3 pt-2 text-sm font-semibold flex justify-between text-gray-800">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
  </Link>
        )
      })}

    </div>
      
    </div>
  )
}
