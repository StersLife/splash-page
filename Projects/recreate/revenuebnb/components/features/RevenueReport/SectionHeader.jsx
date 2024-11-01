import { Button } from '@/components/ui/button'
import CopyButton from '@/components/ui/copy-button'
import { Bookmark } from 'lucide-react'
import React from 'react'

export const SectionHeader = ({
    bedrooms,
    bathrooms,
    address
}) => {
  return (
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-500">Airbnb estimate for</div>
              <h1 className="text-2xl font-semibold">{address}</h1>
              <div className="mt-1 text-sm text-gray-500">{bedrooms} Bedrooms • {bathrooms} baths</div>
            </div>
           <CopyButton /> 
          </div>
  )
}
