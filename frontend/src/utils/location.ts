import type { LocationState } from '../types';

const KNOWN_HUBS = [
  { city: 'Bengaluru', area: 'Church Street & Central', lat: 12.9716, lng: 77.5946 },
  { city: 'Delhi', area: 'North Campus & Hudson Lane', lat: 28.6942, lng: 77.2065 },
  { city: 'Mumbai', area: 'Bandra & Marine Drive', lat: 18.9438, lng: 72.8234 },
  { city: 'Pune', area: 'FC Road & Shivajinagar', lat: 18.5204, lng: 73.8567 },
  { city: 'Hyderabad', area: 'Gachibowli & Cybercity', lat: 17.4474, lng: 78.3582 },
  { city: 'Chennai', area: 'Besant Nagar & Adyar', lat: 13.0012, lng: 80.2565 },
  { city: 'Kolkata', area: 'Park Street & College Street', lat: 22.5535, lng: 88.3524 },
  { city: 'Manipal', area: 'Tiger Circle & MIT Campus', lat: 13.3409, lng: 74.7421 },
  { city: 'Jaipur', area: 'C-Scheme & Malviya Nagar', lat: 26.9124, lng: 75.7873 }
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function detectLiveLocation(): Promise<LocationState> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedCity = 'Bengaluru';
        let detectedArea = 'Current Location';

        try {
          // Reverse geocode via OpenStreetMap Nominatim with 4-second timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { 
              headers: { 'Accept-Language': 'en' },
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            
            // Extract City
            detectedCity = address.city || address.town || address.state_district || address.county || address.state || 'Bengaluru';
            
            // Extract Area / Neighborhood
            detectedArea = address.suburb || address.neighbourhood || address.residential || address.road || address.county || address.quarter || `${detectedCity} Central`;
          }
        } catch (err) {
          console.warn('Reverse geocoding network timeout/error, calculating closest student hub:', err);
          
          // Fallback: match to nearest known hub
          let closestHub = KNOWN_HUBS[0];
          let minDistance = Infinity;

          for (const hub of KNOWN_HUBS) {
            const dist = calculateDistanceKm(latitude, longitude, hub.lat, hub.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestHub = hub;
            }
          }

          if (minDistance <= 70) {
            detectedCity = closestHub.city;
            detectedArea = closestHub.area;
          } else {
            detectedCity = closestHub.city;
            detectedArea = `Within ${Math.round(minDistance)}km of ${closestHub.city}`;
          }
        }

        const locationResult: LocationState = {
          city: detectedCity,
          area: detectedArea,
          latitude,
          longitude,
          isDetected: true
        };

        try {
          localStorage.setItem('twy_location', JSON.stringify(locationResult));
        } catch {}

        resolve(locationResult);
      },
      (error) => {
        let msg = 'Location request failed.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}
