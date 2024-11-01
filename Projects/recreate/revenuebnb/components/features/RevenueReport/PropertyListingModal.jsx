import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PropertyListingModal = ({ open, onClose, property }) => {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dialoge-content">
        <div className="hidden">

          <DialogTitle>
            Property Details
          </DialogTitle>
        </div>

        <div className="relative max-h-[90vh] flex flex-col">
          {/* Close button */}
          <DialogClose className="absolute right-3 top-3 z-50" asChild>
            <button className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </DialogClose>

          {/* Top section */}
          <div className="flex border-b border-gray-200">
            {/* Left side - Image */}
            <div className="w-1/2 relative h-[300px]">
              <Image
                src={`https://a0.muscache.com/im/pictures/${property?.thumbnail_url}?aki_policy=large`}
                alt="Property"
                layout="fill"
                objectFit="cover"
                className="rounded-tl-lg"
              />
              <Badge
                variant="secondary"
                className="absolute top-3 left-3 bg-white text-gray-500 text-xs py-1"
              >
                109 mi
              </Badge>
            </div>

            {/* Right side - Property details */}
            <div className="w-1/2 p-4">
              <div className="text-lg">
                ${property.annual_revenue_ltm} <span className="text-sm">/yr</span>
              </div>

              <div className="mt-2 text-sm font-semibold">
                {property.bedrooms} Bedroom • {property.bathrooms} Bath • {property.accommodates} Guests
              </div>

              <div className="py-3 border-b border-gray-200">
                {property.name}
              </div>

              <div className="space-y-3 mt-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>ADR</span>
                  <span>${property.average_daily_rate_ltm}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Occupancy</span>
                  <span>{property.average_occupancy_rate_ltm}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Reviews</span>
                  <span>{property.review_scores_rating}({property.visible_review_count})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content - Now properly contained */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="px-6 py-5">
              <div className="sticky top-0 bg-white pb-3 z-10">
                <Button
                  variant="default"
                  className="rounded-full bg-black hover:bg-gray-800 text-white"
                  size="sm"
                >
                  Amenities
                </Button>
              </div>

              <div>
                {Object.entries(property.amenities).map(([amenity, value]) => (
                  <div
                    key={amenity}
                    className="flex justify-between items-center py-1 border-b border-gray-200 text-gray-600 text-sm"
                  >
                    <span className="capitalize">{amenity}</span>
                    <span>{value === true ? 'Yes' : 'No'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 mt-auto">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                View complete details on Airbnb
              </div>
              <Button
                variant="default"
                size="sm"
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6 flex items-center gap-1 transition-all duration-200 hover:gap-2"
                onClick={() => window.open(`https://www.airbnb.com/rooms/${property.listing_id}`)}
              >
                View listing
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyListingModal;