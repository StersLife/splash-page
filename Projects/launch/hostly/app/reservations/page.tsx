// app/reservations/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { isUpsellVisible } from '@/lib/upsell-utils'
import DynamicUpsells from '@/components/DynamicUpsells'
import UpsellTestingTool from '@/components/UpsellTestingTool'
import type { UpsellProperty, Reservation } from '@/lib/upsell-utils'

type Props = {
  params: { id: string }
}

export default async function ReservationPage({ params }: Props) {
  const { id } = params
  const supabase = await createClient()

  const { data: reservation, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single() as { data: Reservation, error: any }

  if (error || !reservation) {
    console.error(error)
    notFound()
  }

  const { data: upsellProps, error: upsellError } = await supabase
    .from('upsell_properties')
    .select(`
      upsell:upsell_id (
        *,
        upsell_items (*),
        upsell_visibility_rules (*)
      )
    `)
    .eq('property_id', reservation.property_id) as { data: UpsellProperty[], error: any }

  if (upsellError) {
    console.error(upsellError)
    notFound()
  }

  // Filter upsells based on visibility rules (for initial server-side render)
  const visibleUpsells = upsellProps
    .filter(entry => isUpsellVisible(entry.upsell, reservation))
    .map(entry => entry.upsell)

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Reservation Details</h1>
      
      <div className="border rounded p-4 bg-gray-50 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Reservation ID</div>
            <div className="font-medium">{reservation.id}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Property ID</div>
            <div className="font-medium">{reservation.property_id}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Arrival Date</div>
            <div className="font-medium">
              {new Date(reservation.arrival_date).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Departure Date</div>
            <div className="font-medium">
              {new Date(reservation.departure_date).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <DynamicUpsells 
        reservationId={id} 
        initialUpsells={visibleUpsells}
        reservation={reservation}
      />
      
      {/* Testing tool for developers */}
      <UpsellTestingTool
        reservationId={id}
        reservation={reservation}
      />
    </div>
  )
}