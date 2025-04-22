'use client'

import { useState } from 'react'
import Link from 'next/link'
import UpsellAvailabilityStatus from '@/components/upsell-availability-status'
import type { Upsell, Reservation } from '@/lib/upsell-utils'

type DynamicUpsellsProps = {
  reservationId: string
  initialUpsells: Upsell[]
  reservation: Reservation
}

export default function DynamicUpsells({ 
  reservationId, 
  initialUpsells, 
  reservation 
}: DynamicUpsellsProps) {
  const [upsells] = useState<Upsell[]>(initialUpsells)

  if (upsells.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Upsells</h2>
        <div className="p-4 border rounded bg-gray-50 text-gray-600">
          No upsells are currently available for this reservation.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Upsells</h2>
      
      <div className="space-y-4">
        {upsells.map((upsell) => {
          const items = upsell.upsell_items || []
          const total = items.reduce((sum, item) => sum + item.price, 0)

          return (
            <Link 
              key={upsell.id}
              href={`/reservations/${reservationId}/upsells/${upsell.id}`}
              className="block border rounded bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-gray-800">
                    {upsell.display_title || upsell.internal_title}
                  </div>
                  <UpsellAvailabilityStatus 
                    rules={upsell.upsell_visibility_rules}
                    arrivalDate={reservation.arrival_date}
                    departureDate={reservation.departure_date}
                  />
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