const calculateZoomLevel = (radiusInMeters) => {
    const baseZoom = 16 
    const metersPerPixel = radiusInMeters / (window.innerWidth / 4)
    const zoom = Math.log2(156543.03392 / metersPerPixel)
    return Math.min(Math.max(zoom - 0.5, 9), 16)
}

const createCirclePoints = (center, radiusInMeters, points = 64) => {
    const km = radiusInMeters / 1000; // Convert meters to kilometers
    const coordinates = [];
    const distanceX = km / (111.32 * Math.cos(center[1] * Math.PI / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
        const angle = (i * 360) / points;
        const theta = (angle * Math.PI) / 180;
        const x = center[0] + (distanceX * Math.cos(theta));
        const y = center[1] + (distanceY * Math.sin(theta));
        coordinates.push([x, y]);
    }

    // Close the circle by adding the first point again
    coordinates.push(coordinates[0]);

    return {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: coordinates
        },
        properties: {}
    };
};

export {
    calculateZoomLevel,
    createCirclePoints
}