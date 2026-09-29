import type { LocationState } from '../types';

const KNOWN_HUBS = [
  { city: 'Bengaluru', area: 'Church Street & Central', lat: 12.9716, lng: 77.5946 },
  { city: 'Anantapur', area: 'Gorantla & JNTU Campus', lat: 13.985, lng: 77.772 },
  { city: 'Delhi', area: 'North Campus & Hudson Lane', lat: 28.6942, lng: 77.2065 },
  { city: 'Mumbai', area: 'Bandra & Marine Drive', lat: 18.9438, lng: 72.8234 },
  { city: 'Pune', area: 'FC Road & Shivajinagar', lat: 18.5204, lng: 73.8567 },
  { city: 'Hyderabad', area: 'Gachibowli & Cybercity', lat: 17.4474, lng: 78.3582 },
  { city: 'Chennai', area: 'Besant Nagar & Adyar', lat: 13.0012, lng: 80.2565 },
  { city: 'Kolkata', area: 'Park Street & College Street', lat: 22.5535, lng: 88.3524 },
  { city: 'Manipal', area: 'Tiger Circle & MIT Campus', lat: 13.3409, lng: 74.7421 },
  { city: 'Jaipur', area: 'C-Scheme & Malviya Nagar', lat: 26.9124, lng: 75.7873 }
];

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
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

export function getPlacesWithLiveDistance<T extends { latitude: number; longitude: number; distanceKm?: number }>(
  places: T[],
  userLat?: number,
  userLng?: number
): T[] {
  if (userLat === undefined || userLng === undefined || isNaN(userLat) || isNaN(userLng)) {
    return places;
  }

  return places.map(p => {
    let distanceKm = p.distanceKm;
    if (p.latitude && p.longitude) {
      const d = calculateDistanceKm(userLat, userLng, p.latitude, p.longitude);
      distanceKm = Math.round(d * 10) / 10;
    }
    return {
      ...p,
      distanceKm
    };
  });
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
            
            // 1. Identify specific local area / town / village (e.g. Gorantla, Indiranagar, North Campus)
            const localArea = 
              address.village || 
              address.town || 
              address.suburb || 
              address.neighbourhood || 
              address.residential || 
              address.quarter ||
              address.city_district;

            // 2. Filter out raw technical highway/road codes like 'mdr0173', 'nh44', 'sh1'
            const validRoad = address.road && !/^(mdr|nh|sh|ah|odr)\s*\d+/i.test(address.road.trim())
              ? address.road
              : null;

            // 3. Identify primary City or District (e.g. Anantapur, Bengaluru, Delhi)
            let primaryCity = 
              (address.county && address.county.toLowerCase().includes('anantapur') ? 'Anantapur' : null) ||
              address.city || 
              address.county || 
              address.town || 
              address.state_district || 
              address.state || 
              'Bengaluru';

            // Clean administrative suffixes
            primaryCity = primaryCity.replace(/\s*(District|Urban|Rural|Central City Corporation)$/i, '').trim();

            let displayArea = localArea || validRoad || `${primaryCity} Central`;
            displayArea = displayArea.replace(/\s*(Urban|Rural)$/i, '').trim();

            // Disambiguate if area and city match
            if (displayArea.toLowerCase() === primaryCity.toLowerCase()) {
              if (address.state_district && address.state_district.toLowerCase() !== primaryCity.toLowerCase()) {
                primaryCity = address.state_district.replace(/\s*District$/i, '').trim();
              } else if (address.county && address.county.toLowerCase() !== primaryCity.toLowerCase()) {
                primaryCity = address.county.replace(/\s*District$/i, '').trim();
              } else {
                displayArea = `${primaryCity} Central`;
              }
            }

            detectedCity = primaryCity;
            detectedArea = displayArea;
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
