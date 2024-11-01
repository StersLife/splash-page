'use client'

import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapDropdown } from './MapDropdown'
import PropertyListingModal from './PropertyListingModal'
import { calculateZoomLevel, createCirclePoints } from '@/utils/map'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

const getHtmlMarker = (value) => {
    return `<div class="lock-container cursor-pointer"><p><strong id="map-data">${value}</strong></p></div>`
}

const createHomeInstance = (mapInstance, report, handleToggle) => {
    const customMarkerElement = document.createElement('div')
    customMarkerElement.className = 'custom-marker'
    customMarkerElement.innerHTML = '<div class="home-container home-lock"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4zm2-15.586 6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586l6-6z" fill="currentColor"/></svg></div>'

    const marker = new mapboxgl.Marker(customMarkerElement)
        .setLngLat(report.location.coordinates)
        .addTo(mapInstance)

    let currentPopup = null

    const showPopup = () => {
        if (currentPopup) return

        currentPopup = new mapboxgl.Popup({ 
            offset: 25, 
            className: 'home-popup', 
            closeOnClick: false, 
            closeButton: false 
        })
            .setLngLat(marker.getLngLat())
            .setHTML(`<h3 class="text-lg font-medium">${report.location.address}</h3>`)
            .addTo(mapInstance)
    }

    const hidePopup = () => {
        if (currentPopup) {
            currentPopup.remove()
            currentPopup = null
        }
    }

    customMarkerElement.addEventListener('mouseenter', showPopup)
    customMarkerElement.addEventListener('mouseleave', hidePopup)

    customMarkerElement.addEventListener('click', (e) => {
        e.stopPropagation()
        hidePopup()
        handleToggle({
            ...report,
            name: report.location || 'Customer Property',
            thumbnail_url: report.image_url || '',
            annual_revenue_ltm: report.analysis_data?.message?.estimated_revenue || 0,
            average_daily_rate_ltm: report.analysis_data?.message?.average_daily_rate || 0,
            average_occupancy_rate_ltm: report.analysis_data?.message?.occupancy_rate || 0,
            bedrooms: report.bedrooms || 0,
            bathrooms: report.bathrooms || 0
        })
    })

    return marker
}

const createComparableInstance = (mapInstance, data, handleToggle) => {
    const customMarkerElement = document.createElement('div')
    customMarkerElement.className = 'custom-marker cursor-pointer'
    customMarkerElement.innerHTML = getHtmlMarker(`${data.average_occupancy_rate_ltm}%`)

    let currentPopup = null

    const marker = new mapboxgl.Marker(customMarkerElement)
        .setLngLat([data.longitude, data.latitude])
        .addTo(mapInstance)

    const showPopup = () => {
        if (currentPopup) return

        currentPopup = new mapboxgl.Popup({ 
            offset: 25, 
            className: 'home-popup', 
            closeOnClick: false, 
            closeButton: false 
        })
            .setLngLat(marker.getLngLat())
            .setHTML(`
                <div class="comparable-item">
                    <img class="property-image" src="https://a0.muscache.com/im/pictures/${data.thumbnail_url}?aki_policy=large" alt="${data.name}">
                    <div class="details">
                        <div class="price">
                            <strong>$${data.annual_revenue_ltm}</strong><small>/yr</small>
                        </div>
                        <div class="features">
                            ${data.bedrooms} Br • ${data.bathrooms} Ba • 9 Guests
                        </div>
                        <div class="property-name">
                            ${data.name.slice(0, 22)}...
                        </div>
                        <div class="occupancy">
                            $${data.average_daily_rate_ltm} ADR ${data.average_occupancy_rate_ltm}% Occup.
                        </div>
                    </div>
                </div>
            `)
            .addTo(mapInstance)
    }

    const hidePopup = () => {
        if (currentPopup) {
            currentPopup.remove()
            currentPopup = null
        }
    }

    customMarkerElement.addEventListener('mouseenter', showPopup)
    customMarkerElement.addEventListener('mouseleave', hidePopup)

    customMarkerElement.addEventListener('click', (e) => {
        e.stopPropagation()
        hidePopup()
        handleToggle(data)
    })

    return marker
}

const ListingsMap = ({ compareableProperty, report }) => {
    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const [currentSelectedMapDataType, setCurrentSelectedMapDataType] = useState('Occupancy')
    const markers = useRef([])
    const markersData = useRef([])
    const [isOpen, setIsOpen] = useState(false)
    const [currentClickedProperty, setCurrentClickedProperty] = useState(null)

    const handleToggle = (data) => {
        setCurrentClickedProperty(data)
        setIsOpen(true)
    }

    const handleClose = () => {
        setCurrentClickedProperty(null)
        setIsOpen(false)
    }

    useEffect(() => {
        if (!mapContainer.current || !report?.location?.coordinates) return

        const radius = report?.analysis_data?.message?.radius_used
        const center = report.location.coordinates
        
        const dynamicZoom = calculateZoomLevel(radius)

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: center,
            zoom: dynamicZoom,
        })
        mapRef.current = map

        map.on('load', () => {
            if (center && radius) {
                const circleGeojson = createCirclePoints(center, radius)

                map.addLayer({
                    id: 'circle-fill',
                    type: 'fill',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            geometry: {
                                type: 'Polygon',
                                coordinates: [circleGeojson.geometry.coordinates]
                            },
                            properties: {}
                        }
                    },
                    paint: {
                        'fill-color': '#009DAE',
                        'fill-opacity': 0.08
                    }
                })

                map.addLayer({
                    id: 'circle-outline',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: circleGeojson
                    },
                    paint: {
                        'line-color': '#009DAE',
                        'line-width': 3,
                        'line-opacity': 1
                    }
                })

                const bounds = new mapboxgl.LngLatBounds()
                circleGeojson.geometry.coordinates.forEach(coord => {
                    bounds.extend(coord)
                })
                map.fitBounds(bounds, {
                    padding: 50,
                    duration: 0
                })
            }

            markers.current.forEach(marker => marker.remove())
            markers.current = []
            markersData.current = []

            if (compareableProperty?.length) {
                compareableProperty.forEach((property, index) => {
                    const marker = createComparableInstance(map, { ...property, index }, handleToggle)
                    markers.current.push(marker)
                    markersData.current.push(property)
                })
            }

            if (report) {
                createHomeInstance(map, report, handleToggle)
            }
        })

        return () => {
            map.remove()
            markers.current.forEach(marker => marker.remove())
        }
    }, [report, compareableProperty])

    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        markers.current.forEach((marker, index) => {
            const markerElement = marker.getElement()
            const propertyData = markersData.current[index]

            if (!propertyData) return

            let displayValue = ''
            switch (currentSelectedMapDataType) {
                case 'Occupancy':
                    displayValue = `${propertyData.average_occupancy_rate_ltm}%`
                    break
                case 'Annual revenue':
                    displayValue = `$${Math.ceil(propertyData.annual_revenue_ltm / 1000)}k`
                    break
                default:
                    displayValue = `$${propertyData.average_daily_rate_ltm}`
            }

            markerElement.innerHTML = getHtmlMarker(displayValue)
        })
    }, [currentSelectedMapDataType])

    return (
        <>
            <MapDropdown onSelect={setCurrentSelectedMapDataType} />
            <div ref={mapContainer} className="w-full h-full" />
           
                <PropertyListingModal 
                    property={currentClickedProperty} 
                    open={isOpen} 
                    onClose={handleClose} 
                />
           
        </>
    )
}

export default ListingsMap