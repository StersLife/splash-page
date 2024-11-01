import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { MapPin, Search } from 'lucide-react'
import React from 'react'

const Header = ({
    bedrooms,
    bathrooms,
    address
}) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-semibold">RevenueBnB</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-4 px-8">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
              readOnly

                className="w-full cursor-not-allowed rounded-full  border-gray-200 bg-gray-50 pl-10 pr-4"
                defaultValue={address}
                type="text"
              />
            </div>
            <Badge variant="outline" className="rounded-full border-gray-200">
              {bedrooms} Bedrooms • {bathrooms} baths
            </Badge>
            {/* <Badge variant="outline" className="rounded-full border-gray-200">
              4 Guests
            </Badge> */}
          </div>
        </div>
      </header>
  )
}

export default Header