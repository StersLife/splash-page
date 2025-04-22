// components/UpsellAvailabilityStatus.tsx
'use client'

import { useState, useEffect } from 'react'
import type { UpsellVisibilityRule } from '@/lib/upsell-utils'
import { getVisibilityRuleDescription } from '@/lib/upsell-utils'

type UpsellAvailabilityStatusProps = {
  rules: UpsellVisibilityRule[]
  arrivalDate: string
  departureDate: string
}

export default function UpsellAvailabilityStatus({ 
  rules, 
  arrivalDate, 
  departureDate 
}: UpsellAvailabilityStatusProps) {
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('')
  const [isAvailable, setIsAvailable] = useState<boolean>(true)

  useEffect(() => {
    // If no rules, always available
    if (!rules || rules.length === 0) {
      setAvailabilityMessage('Always available')
      setIsAvailable(true)
      return
    }
    
    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)
    const now = new Date()
    
    // Check all rules
    let available = true
    let message = ''
    
    rules.forEach(rule => {
      const ruleDescription = getVisibilityRuleDescription(rule)
      
      // Calculate time windows for each rule
      const multiplier = rule.unit === 'hours' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
      const timeValue = rule.value * multiplier
      
 
      
      switch (rule.rule_type) {
        case 'Before Check-in': {
          const windowStart = new Date(arrival.getTime() - timeValue)
          if (now < windowStart || now > arrival) {
            available = false
            message = `Not currently available (${ruleDescription})`
          }
          break
        }
        case 'After Check-in': {
          const windowEnd = new Date(arrival.getTime() + timeValue)
          if (now < arrival || now > windowEnd) {
            available = false
            message = `Not currently available (${ruleDescription})`
          }
          break
        }
        case 'Before Checkout': {
          const windowStart = new Date(departure.getTime() - timeValue)
          if (now < windowStart || now > departure) {
            available = false
            message = `Not currently available (${ruleDescription})`
          }
          break
        }
      }
    })
    
    if (available) {
      setAvailabilityMessage('Available now')
    } else {
      setAvailabilityMessage(message)
    }
    
    setIsAvailable(available)
  }, [rules, arrivalDate, departureDate])

  return (
    <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center
      ${isAvailable 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-600'}`}
    >
      <span className={`w-2 h-2 rounded-full mr-1 
        ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}
      />
      {availabilityMessage}
    </div>
  )
}