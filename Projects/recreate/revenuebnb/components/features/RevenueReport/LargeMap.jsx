'use client'
import React from 'react'
import ListingsMap from './ListingsMap'
const LargeMap = ({
    compareableProperty,
    report
}) => {
        return (
            <div className="sticky hide-map top-[5.5rem] h-[calc(100vh-6rem)] overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="relative  h-full w-full ">

                <div className='  relative h-full w-full'>
                    <ListingsMap
                        compareableProperty={compareableProperty}
                        report={report}
                    />
                </div>
            </div>
        </div>
        )
    


}

export default LargeMap