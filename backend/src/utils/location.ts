// Convert kilometers to degrees (approximate)
const kmToDegrees = (km: number): number => {
  return km / 111.32; // 1 degree is approximately 111.32 km
};

// Generate random number between min and max
const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate random coordinates within radius
export const generateRandomCoordinates = (
  centerLat: number,
  centerLng: number,
  radiusKm: number
): [number, number] => {
  const radiusInDegrees = kmToDegrees(radiusKm);

  const lat = randomBetween(
    centerLat - radiusInDegrees,
    centerLat + radiusInDegrees
  );
  
  // Adjust for longitude distance changing with latitude
  const lngRadius = radiusInDegrees / Math.cos(centerLat * (Math.PI / 180));
  const lng = randomBetween(
    centerLng - lngRadius,
    centerLng + lngRadius
  );

  return [lng, lat]; // Return [longitude, latitude] for GeoJSON format
}; 