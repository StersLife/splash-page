'use client'

import { useState } from 'react'
import type { Upsell, Reservation } from '@/lib/upsell-utils'
import UpsellAvailabilityStatus from './upsell-availability-status'

type UpsellTestingToolProps = {
  reservationId: string
  reservation: Reservation
}

export default function UpsellTestingTool({ 
  reservationId, 
  reservation 
}: UpsellTestingToolProps) {
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().slice(0, 16))
  const [upsells, setUpsells] = useState<Upsell[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  console.log({
    upsells
  })

  const handleTest = async () => {
    setLoading(true)

    try {
      // Convert selected datetime to ISO string for the API
      const timestamp = new Date(testDate).toISOString()
      
      // Debug calculations locally
      const currentTime = new Date(testDate);
      const arrivalDate = new Date(reservation.arrival_date);
      const departureDate = new Date(reservation.departure_date);
      
      // Log testing info
      console.log("Testing Date/Time:", currentTime.toLocaleString());
      console.log("Arrival Date:", arrivalDate.toLocaleString());
      console.log("Departure Date:", departureDate.toLocaleString());
      
      // Calculate days difference
      const msPerDay = 1000 * 60 * 60 * 24;
      const daysTillArrival = Math.round((arrivalDate.getTime() - currentTime.getTime()) / msPerDay);
      const daysSinceDeparture = Math.round((currentTime.getTime() - departureDate.getTime()) / msPerDay);
      
      console.log("Days until arrival:", daysTillArrival);
      console.log("Days since departure:", daysSinceDeparture);
      
      // Add additional logging
      console.log("Making API request with timestamp:", timestamp);
      
      const response = await fetch(
        `/api/reservations/${reservationId}/upsells?timestamp=${encodeURIComponent(timestamp)}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch test data')
      }
      
      const data = await response.json()
      console.log("API response:", data);
      setUpsells(data.upsells)
    } catch (error) {
      console.error('Test error:', error)
    } finally {
      setLoading(false)
    }
  }
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Show Testing Tool
      </button>
    )
  }

  return (
    <div className="border rounded p-4 bg-gray-50 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Testing Tool</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="text-sm mb-4">
        <p>Test how upsell availability changes at different times:</p>
      </div>
      
      <div className="flex items-end gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Date & Time
          </label>
          <input 
            type="datetime-local" 
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Test'}
        </button>
      </div>
      
      {upsells.length > 0 ? (
        <div>
          <h4 className="font-medium mb-2">Available Upsells at Selected Time:</h4>
          <ul className="space-y-2">
            {upsells.map(upsell => (
              <li key={upsell.id} className="border rounded p-3 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{upsell.display_title || upsell.internal_title}</span>
                  <UpsellAvailabilityStatus 
                    rules={upsell.upsell_visibility_rules}
                    arrivalDate={reservation.arrival_date}
                    departureDate={reservation.departure_date}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Rules:
                  <ul className="ml-4 list-disc">
                    {upsell.upsell_visibility_rules.map(rule => (
                      <li key={rule.id}>
                        {rule.rule_type}: {rule.value} {rule.unit}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : upsells.length === 0 && !loading ? (
        <div className="text-gray-500 text-sm">
          No upsells available at the selected time.
        </div>
      ) : null}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Note: This tool is for testing purposes only. It simulates upsell visibility at different times.</p>
        <p>Arrival date: {new Date(reservation.arrival_date).toLocaleString()}</p>
        <p>Departure date: {new Date(reservation.departure_date).toLocaleString()}</p>
      </div>
    </div>
  )
}