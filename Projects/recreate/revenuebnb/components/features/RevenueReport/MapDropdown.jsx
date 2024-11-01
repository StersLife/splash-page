'use client'
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const MapDropdown = ({ onSelect }) => {
    const [occupancy, setOccupancy] = useState('');

    return (
        <div className="absolute top-5 left-[45%] z-[99] w-[170px]">
            <Select value={occupancy} onValueChange={(value) => {
                setOccupancy(value);
                onSelect(value);

            }}>
                <SelectTrigger 
                    className="bg-white font-semibold text-sm h-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]"
                >
                    <SelectValue placeholder="Occupancy" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                    <SelectItem 
                        value="Occupancy" 
                        className="text-sm font-semibold"
                    >
                        Occupancy
                    </SelectItem>
                    <SelectItem 
                        value="Annual revenue" 
                        className="text-sm font-semibold"
                    >
                        Annual revenue
                    </SelectItem>
                    <SelectItem 
                        value="Average daily rate" 
                        className="text-sm font-semibold"
                    >
                        Average daily rate
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};