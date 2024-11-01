'use client'

import { formatCurrency } from '@/utils/formate'
import Image from 'next/image'
import React from 'react'

const Listing = ({
  list,
  handleSelect
}) => {
  return (
    <div
      key={list.listing_id}
      onClick={() => handleSelect(list)}
      className="cursor-pointer flex flex-col lg:flex-row gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
    >
      <Image
        alt="Property"
        className="h-48 w-full lg:w-48 lg:h-32 rounded-xl object-cover shadow-sm"
        height={128}
        src={`https://a0.muscache.com/im/pictures/${list?.thumbnail_url}?aki_policy=large`}
        width={192}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAECEf/aAAwDAQACEQMRAD8AoNxbhL3xvpeNluNyeQ0pwCxJGwA5l01K+fz8HnU00tExYtux2HaH/9k="
      />
      <div className="flex flex-1 flex-col">
        <h4 className="text-base font-semibold tracking-tight text-gray-900 font-GTRegular">{list.name}</h4>
        <p className="mt-1.5 text-sm font-medium text-gray-600 font-GTRegular">
          {list.bedrooms} Bedrooms • {list.bathrooms} baths • {list.accommodates} Guests
        </p>
        <div className="mt-4 flex flex-row items-center justify-between gap-4 font-GTBold">
          <div className="space-y-0.5">
            <div className="text-lg font-bold text-gray-900">{formatCurrency(list.annual_revenue_potential)}</div>
            <div className="text-sm font-medium text-gray-500">Daily rate {formatCurrency(list.average_daily_rate_ltm)}</div>
          </div>
          <div className="text-right space-y-0.5">
            <div className="text-lg font-bold text-green-600">{list.average_occupancy_rate_ltm}%</div>
            <div className="text-sm font-medium text-gray-500">Occupancy</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Listing