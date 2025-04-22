// app/api/debug/rule-evaluation/route.ts
import { NextRequest } from 'next/server'
import { addTimeToDate } from '@/lib/upsell-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      rule_type, 
      value, 
      unit, 
      arrival_date, 
      departure_date, 
      current_time 
    } = body;
    
    // Convert all dates to Date objects
    const arrivalDate = new Date(arrival_date);
    const departureDate = new Date(departure_date);
    const testTime = new Date(current_time);
    
    // Calculate time windows for each rule type
    let result = {
      rule_type,
      value,
      unit,
      arrival_date: arrivalDate.toISOString(),
      departure_date: departureDate.toISOString(),
      test_time: testTime.toISOString(),
      days_until_arrival: Math.round((arrivalDate.getTime() - testTime.getTime()) / (1000 * 60 * 60 * 24)),
      days_until_departure: Math.round((departureDate.getTime() - testTime.getTime()) / (1000 * 60 * 60 * 24)),
      visibility_window_start: null,
      visibility_window_end: null,
      evaluation_details: {},
      is_visible: false
    };
    
    switch (rule_type) {
      case 'Before Check-in': {
        const visibilityWindowStart = addTimeToDate(arrivalDate, -value, unit);
        result.visibility_window_start = visibilityWindowStart.toISOString();
        result.visibility_window_end = arrivalDate.toISOString();
        
        const beforeArrival = testTime <= arrivalDate;
        const afterWindowStart = testTime >= visibilityWindowStart;
        
        result.evaluation_details = {
          testTime: testTime.toISOString(),
          visibilityWindowStart: visibilityWindowStart.toISOString(),
          arrivalDate: arrivalDate.toISOString(),
          check1: `testTime <= arrivalDate: ${beforeArrival}`,
          check2: `testTime >= visibilityWindowStart: ${afterWindowStart}`,
        };
        
        result.is_visible = beforeArrival && afterWindowStart;
        break;
      }
      case 'After Check-in': {
        const visibilityWindowEnd = addTimeToDate(arrivalDate, value, unit);
        result.visibility_window_start = arrivalDate.toISOString();
        result.visibility_window_end = visibilityWindowEnd.toISOString();
        
        const afterArrival = testTime >= arrivalDate; 
        const beforeWindowEnd = testTime <= visibilityWindowEnd;
        
        result.evaluation_details = {
          testTime: testTime.toISOString(),
          arrivalDate: arrivalDate.toISOString(),
          visibilityWindowEnd: visibilityWindowEnd.toISOString(),
          check1: `testTime >= arrivalDate: ${afterArrival}`,
          check2: `testTime <= visibilityWindowEnd: ${beforeWindowEnd}`,
        };
        
        result.is_visible = afterArrival && beforeWindowEnd;
        break;
      }
      case 'Before Checkout': {
        const visibilityWindowStart = addTimeToDate(departureDate, -value, unit);
        result.visibility_window_start = visibilityWindowStart.toISOString();
        result.visibility_window_end = departureDate.toISOString();
        
        const beforeDeparture = testTime <= departureDate;
        const afterWindowStart = testTime >= visibilityWindowStart;
        
        result.evaluation_details = {
          testTime: testTime.toISOString(),
          visibilityWindowStart: visibilityWindowStart.toISOString(),
          departureDate: departureDate.toISOString(),
          check1: `testTime <= departureDate: ${beforeDeparture}`,
          check2: `testTime >= visibilityWindowStart: ${afterWindowStart}`,
        };
        
        result.is_visible = beforeDeparture && afterWindowStart;
        break;
      }
    }
    
    return Response.json(result);
  } catch (error) {
    console.error('Error in rule evaluation debug:', error);
    return Response.json(
      { error: 'Failed to process debug request' },
      { status: 500 }
    );
  }
}