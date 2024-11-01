'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import React from 'react'
import Listing from './Listing'
import PropertyListingModal from './PropertyListingModal'
import ViewModeToggle from './ViewModeToggle'
import { Card, CardContent } from '@/components/ui/card'
import ListingsMap from './ListingsMap'

// More accurate distance calculation function
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // meters = earth's radius (approx)

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const dLat = lat2Rad - lat1Rad;
    const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distance in meters
};

const sortingOptions = [
    { value: "nearest", label: "Nearest" },
    { value: "occupancy-high", label: "Occupancy Rate: High to Low" },
    { value: "occupancy-low", label: "Occupancy Rate: Low to High" },
    { value: "avg-daily-rate-high", label: "Average Daily Rate: High to Low" },
    { value: "avg-daily-rate-low", label: "Average Daily Rate: Low to High" },
    { value: "revenue-mo-high", label: "Monthly Revenue: High to Low" },
    { value: "revenue-mo-low", label: "Monthly Revenue: Low to High" }
]

const SimilarListing = ({
    listings,
    baseLocation = { coordinates: [0, 0] },
    report

}) => {
    const [viewMode, setViewMode] = useState('list')
    const [sortedListings, setSortedListings] = useState(listings)
    const [currentSort, setCurrentSort] = useState("nearest")
    const [isOpen, setIsOpen] = useState(false)
    const [currentSelectedProperty, setCurrentSelectedProperty] = useState(null)


    const handleClose = () => {
        setIsOpen(false)
        setCurrentSelectedProperty(null)
    }




    const sortListings = (selectedOption) => {
        let sorted = [...listings]

        if (selectedOption === "nearest") {
            sorted.sort((a, b) => {
                const distanceA = calculateDistance(
                    baseLocation.coordinates[1],
                    baseLocation.coordinates[0],
                    a.latitude,
                    a.longitude
                )
                const distanceB = calculateDistance(
                    baseLocation.coordinates[1],
                    baseLocation.coordinates[0],
                    b.latitude,
                    b.longitude
                )
                return distanceA - distanceB
            })
        } else {
            switch (selectedOption) {
                case "occupancy-high":
                    sorted.sort((a, b) => b.average_occupancy_rate_ltm - a.average_occupancy_rate_ltm)
                    break
                case "occupancy-low":
                    sorted.sort((a, b) => a.average_occupancy_rate_ltm - b.average_occupancy_rate_ltm)
                    break
                case "avg-daily-rate-high":
                    sorted.sort((a, b) => b.average_daily_rate_ltm - a.average_daily_rate_ltm)
                    break
                case "avg-daily-rate-low":
                    sorted.sort((a, b) => a.average_daily_rate_ltm - b.average_daily_rate_ltm)
                    break
                case "revenue-mo-high":
                    sorted.sort((a, b) => b.annual_revenue_ltm - a.annual_revenue_ltm)
                    break
                case "revenue-mo-low":
                    sorted.sort((a, b) => a.annual_revenue_ltm - b.annual_revenue_ltm)
                    break
                default:
                    break
            }
        }

        setSortedListings(sorted)
    }

    const handleSelect = (value) => {

        setIsOpen(true)
        setCurrentSelectedProperty(value)
    }
    const handleSort = (value) => {
        setCurrentSort(value)
        sortListings(value)
    }

    return (
        < >
            <div className="flex items-center justify-between">

            <ViewModeToggle handleViewChange={(val) => setViewMode(val)} />
            </div>


                    <Card className="overflow-hidden border-gray-200 bg-white">
                        <CardContent className="p-6">
                        <div className='pt-4 pb-4'>
                                        <h3 className="text-lg font-semibold">Similar Properties</h3>
                                    </div>
            {
                viewMode === 'list' && (
                            <div className="space-y-6 pt-6">
                                <div className="flex items-center justify-between">

                            
                                    <div className="flex items-center gap-3">
                                        <Select defaultValue="nearest" onValueChange={handleSort}>
                                            <SelectTrigger className="w-[160px]">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent style={{ backgroundColor: 'white', zIndex: 1000 }}>
                                                {sortingOptions.map(option => (
                                                    <SelectItem
                                                        className='cursor-pointer hover:bg-slate-300'
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-6 min-[550px]:space-y-0 grid grid-cols-1 min-[550px]:grid-cols-2 md:grid-cols-1">
                                    {sortedListings.map((list) => (
                                        <Listing
                                            key={list.listing_id}
                                            handleSelect={handleSelect}
                                            list={list}
                                        />
                                    ))}
                                </div>
                                <PropertyListingModal
                                    open={isOpen}
                                    onClose={handleClose}
                                    property={currentSelectedProperty}
                                />
                            </div>
                )

            }
            {
                viewMode === 'map' && (
                    <div className='hide-toggle w-full h-[400px]'>
                        <ListingsMap compareableProperty={listings} report={report} />
                    </div>
                )
            }
                        </CardContent>
                    </Card>

        </>
    )
}

export default SimilarListing