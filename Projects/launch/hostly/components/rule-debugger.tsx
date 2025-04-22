'use client'

import { useState } from 'react'
import { addTimeToDate } from '@/lib/upsell-utils'

export default function RuleDebugger() {
  const [ruleType, setRuleType] = useState<string>('Before Check-in')
  const [value, setValue] = useState<number>(7)
  const [unit, setUnit] = useState<string>('days')
  const [arrivalDate, setArrivalDate] = useState<string>('2025-04-15T15:00:00')
  const [departureDate, setDepartureDate] = useState<string>('2025-06-06T10:00:00')
  const [testDate, setTestDate] = useState<string>(new Date().toISOString().slice(0, 16))
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleDebug = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/debug/rule-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rule_type: ruleType,
          value,
          unit,
          arrival_date: arrivalDate,
          departure_date: departureDate,
          current_time: testDate,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to evaluate rule')
      }
      
      const data = await response.json()
      setResult(data)
      
      // Also calculate locally to verify
      const arrivalDateTime = new Date(arrivalDate)
      const departureDateTime = new Date(departureDate)
      const testDateTime = new Date(testDate)
      
      let localResult = false
      switch (ruleType) {
        case 'Before Check-in': {
          const visibilityWindow = addTimeToDate(arrivalDateTime, -value, unit as any)
          localResult = testDateTime <= arrivalDateTime && testDateTime >= visibilityWindow
          break
        }
        case 'After Check-in': {
          const visibilityWindow = addTimeToDate(arrivalDateTime, value, unit as any)
          localResult = testDateTime >= arrivalDateTime && testDateTime <= visibilityWindow
          break
        }
        case 'Before Checkout': {
          const visibilityWindow = addTimeToDate(departureDateTime, -value, unit as any)
          localResult = testDateTime <= departureDateTime && testDateTime >= visibilityWindow
          break
        }
      }
      
      console.log('Client-side evaluation:', localResult)
    } catch (error) {
      console.error('Debug error:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatDateTime(dateString: string) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  return (
    <div className="border rounded p-4 bg-gray-50 mt-6">
      <h3 className="font-medium mb-4">Rule Debugger</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Type
            </label>
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="Before Check-in">Before Check-in</option>
              <option value="After Check-in">After Check-in</option>
              <option value="Before Checkout">Before Checkout</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Arrival Date
            </label>
            <input
              type="datetime-local"
              value={arrivalDate.slice(0, 16)}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <input
              type="datetime-local"
              value={departureDate.slice(0, 16)}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Date & Time
            </label>
            <input
              type="datetime-local"
              value={testDate.slice(0, 16)}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        
        <button
          onClick={handleDebug}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Processing...' : 'Debug Rule'}
        </button>
        
        {result && (
          <div className="mt-4 border rounded p-4 bg-white">
            <h4 className="font-medium mb-2">Debug Results</h4>
            
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium">Rule:</div>
                <div>{result.rule_type}</div>
                
                <div className="font-medium">Value:</div>
                <div>{result.value} {result.unit}</div>
                
                <div className="font-medium">Test Time:</div>
                <div>{formatDateTime(result.test_time)}</div>
                
                <div className="font-medium">Arrival Date:</div>
                <div>{formatDateTime(result.arrival_date)}</div>
                
                <div className="font-medium">Departure Date:</div>
                <div>{formatDateTime(result.departure_date)}</div>
                
                <div className="font-medium">Days Until Arrival:</div>
                <div>{result.days_until_arrival}</div>
                
                <div className="font-medium">Days Until Departure:</div>
                <div>{result.days_until_departure}</div>
                
                <div className="font-medium">Visibility Window:</div>
                <div>
                  {result.visibility_window_start && formatDateTime(result.visibility_window_start)} to {result.visibility_window_end && formatDateTime(result.visibility_window_end)}
                </div>
                
                <div className="font-medium">Is Visible:</div>
                <div className={result.is_visible ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {result.is_visible ? "YES" : "NO"}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="font-medium mb-1">Evaluation Details:</div>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(result.evaluation_details, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}