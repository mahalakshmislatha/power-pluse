// Geolocation helper with reverse geocoding for Tamil Nadu localities

export function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        // Fallback default: Chennai center if user denies or fails
        resolve({
          lat: 13.0827,
          lng: 80.2707,
          fallback: true
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export async function getAreaName(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    if (!response.ok) throw new Error('Reverse geocoding failed');
    const data = await response.json();
    
    const address = data.address || {};
    const suburb = address.suburb || address.neighbourhood || address.residential || address.subdistrict || address.village || address.town || 'Locality';
    const city = address.city || address.county || address.state_district || 'Tamil Nadu';
    
    return {
      area: `${suburb}, ${city}`,
      district: city
    };
  } catch (err) {
    console.error('Geo error:', err);
    return {
      area: 'Tamil Nadu Area',
      district: 'Tamil Nadu'
    };
  }
}
