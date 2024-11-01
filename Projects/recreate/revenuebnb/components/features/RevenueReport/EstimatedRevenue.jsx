"use client"

import { cn } from "@/utils/cn"

// Format currency function
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function EstimatedRevenue({
  averageHost = {
    revenue: 2500,
    average_daily_rate: 100,
    occupancy_rate: 65
  },
  professionalHost = {
    revenue: 3800,
    average_daily_rate: 120,
    occupancy_rate: 80
  }
}) {
  return (
    <div className="w-full bg-white">
      <div className="py-4 sm:py-6">
        <div className="flex flex-col space-y-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Estimated Revenue</h2>
          <p className="text-xs sm:text-sm text-gray-500">Monthly</p>
        </div>
        
        <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <HostCard
            title="AVERAGE HOST"
            revenue={averageHost.revenue}
            nightlyRate={averageHost.average_daily_rate}
            occupancy={averageHost.occupancy_rate}
          />
          <HostCard
            title="PROFESSIONAL HOST"
            revenue={professionalHost.revenue}
            nightlyRate={professionalHost.average_daily_rate}
            occupancy={professionalHost.occupancy_rate}
            isPro={true}
          />
        </div>
      </div>
    </div>
  )
}

function HostCard({ title, revenue, nightlyRate, occupancy, isPro = false }) {
  return (
    <div className={cn(
      "space-y-3 sm:space-y-4 p-1 py-3 sm:py-4 rounded-lg",
      isPro ? "bg-teal-50/50" : "bg-transparent"
    )}>
      <div className="text-xs sm:text-sm font-medium text-gray-500">{title}</div>
      <div className={cn(
        "text-2xl sm:text-3xl font-bold",
        isPro ? "text-teal-600" : "text-gray-900"
      )}>
        {formatCurrency(revenue)}
      </div>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-500">Nightly Rate</span>
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {formatCurrency(nightlyRate)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-500">Occupancy</span>
          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {occupancy}%
          </span>
        </div>
      </div>
    </div>
  )
}