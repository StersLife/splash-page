// lib/upsell-utils.ts

export type UpsellVisibilityRule = {
    id: number
    upsell_id: number
    rule_type: 'Before Check-in' | 'After Check-in' | 'Before Checkout'
    value: number
    unit: 'hours' | 'days'
    created_at: string
    updated_at: string
  }
  
  export type UpsellItem = {
    id: number
    upsell_id: number
    name: string
    description: string | null
    price: number
  }
  
  export type Upsell = {
    id: number
    display_title: string
    internal_title: string
    upsell_items: UpsellItem[]
    upsell_visibility_rules: UpsellVisibilityRule[]
  }
  
  export type UpsellProperty = {
    upsell: Upsell
  }
  
  export type Reservation = {
    id: number
    property_id: number
    arrival_date: string // ISO date string
    departure_date: string // ISO date string
  }
  
  // Helper function to add hours or days to a date
  export const addTimeToDate = (date: Date, value: number, unit: 'hours' | 'days'): Date => {
    const newDate = new Date(date)
    if (unit === 'hours') {
      newDate.setHours(newDate.getHours() + value)
    } else if (unit === 'days') {
      newDate.setDate(newDate.getDate() + value)
    }
    return newDate
  }
  
  /**
   * Check if an upsell should be visible based on its rules and the reservation dates
   * 
   * @param upsell The upsell to check visibility for
   * @param reservation The reservation with arrival and departure dates
   * @param currentTime Optional current time to check against (useful for testing)
   * @returns boolean indicating if the upsell should be visible
   */
  export const isUpsellVisible = (
    upsell: Upsell,
    reservation: Reservation,
    currentTime: Date = new Date()
  ): boolean => {
    const rules = upsell.upsell_visibility_rules || []
    console.log({
      rules
    })
    
 

    const arrivalDate = new Date(reservation.arrival_date)
    const departureDate = new Date(reservation.departure_date)
    
    // Check each rule - if ANY rule matches, the upsell should be visible (OR logic)
    return rules.some(rule => {
      switch (rule.rule_type) {
        case 'Before Check-in': {
          // Upsell is visible if current time is before check-in by the specified amount
          const visibilityWindow = addTimeToDate(arrivalDate, -rule.value, rule.unit)
          return currentTime <= arrivalDate && currentTime >= visibilityWindow
        }
        case 'After Check-in': {
          // Upsell is visible if current time is after check-in by the specified amount
          const visibilityWindow = addTimeToDate(arrivalDate, rule.value, rule.unit)
          return currentTime >= arrivalDate && currentTime <= visibilityWindow
        }
        case 'Before Checkout': {
          // Upsell is visible if current time is before checkout by the specified amount
          const visibilityWindow = addTimeToDate(departureDate, -rule.value, rule.unit)
          return currentTime <= departureDate && currentTime >= visibilityWindow
        }
        default:
          return false
      }
    })
  }
  
  /**
   * Get a human-readable description of a visibility rule
   * 
   * @param rule The visibility rule to describe
   * @returns A human-readable string describing the rule
   */
  export const getVisibilityRuleDescription = (rule: UpsellVisibilityRule): string => {
    const unitText = rule.value === 1 ? rule.unit.slice(0, -1) : rule.unit
    
    switch (rule.rule_type) {
      case 'Before Check-in':
        return `Available ${rule.value} ${unitText} before check-in`
      case 'After Check-in':
        return `Available for ${rule.value} ${unitText} after check-in`
      case 'Before Checkout':
        return `Available ${rule.value} ${unitText} before checkout`
      default:
        return `Unknown rule type: ${rule.rule_type}`
    }
  }