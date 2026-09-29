import type { LocationState, Place } from '../types';

export interface RealTimeLocationResult {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  displayName: string;
  latitude: number;
  longitude: number;
  type?: string;
  distanceKm?: number;
}

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

export async function searchRealTimeLocations(
  query: string,
  userLat?: number,
  userLng?: number
): Promise<RealTimeLocationResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery || cleanQuery.length < 2) return [];

  const results: RealTimeLocationResult[] = [];
  const seen = new Set<string>();

  // 1. Try Photon Komoot API (fast, CORS-friendly, worldwide OpenStreetMap data with high accuracy for India)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=8&lang=en`;
    if (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng)) {
      url += `&lat=${userLat}&lon=${userLng}`;
    } else {
      // Default center bias to India
      url += `&lat=20.5937&lon=78.9629`;
    }

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        for (const feat of data.features) {
          const props = feat.properties || {};
          const geom = feat.geometry || {};
          if (!geom.coordinates || geom.coordinates.length < 2) continue;
          const [lng, lat] = geom.coordinates;
          const name = props.name || props.city || props.district || cleanQuery;
          const city = props.city || props.county || props.district || name;
          const state = props.state || '';
          const country = props.country || 'India';
          const type = props.osm_value || props.type || 'place';

          const key = `${name.toLowerCase()}_${Math.round(lat * 100)}_${Math.round(lng * 100)}`;
          if (!seen.has(key)) {
            seen.add(key);
            const dist = (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng))
              ? Math.round(calculateDistanceKm(userLat, userLng, lat, lng) * 10) / 10
              : undefined;

            results.push({
              id: `geo-photon-${props.osm_id || Math.random().toString(36).substring(2, 9)}`,
              name,
              city,
              state,
              country,
              displayName: [name, city !== name ? city : null, state, country].filter(Boolean).join(', '),
              latitude: lat,
              longitude: lng,
              type,
              distanceKm: dist
            });
          }
        }
      }
    }
  } catch (err) {
    console.warn('Photon geocoding error:', err);
  }

  // 2. Fallback to OpenStreetMap Nominatim if Photon returns fewer than 2 results
  if (results.length < 2) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&format=json&limit=5&countrycodes=in&addressdetails=1`;
      const res = await fetch(nomUrl, {
        headers: { 'User-Agent': 'TravelWithYou/1.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const nomData = await res.json();
        if (Array.isArray(nomData)) {
          for (const item of nomData) {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            if (isNaN(lat) || isNaN(lng)) continue;

            const addr = item.address || {};
            const name = addr.village || addr.town || addr.city || addr.suburb || item.name || cleanQuery;
            const city = addr.city || addr.town || addr.county || addr.state_district || name;
            const state = addr.state || '';
            const country = addr.country || 'India';

            const key = `${name.toLowerCase()}_${Math.round(lat * 100)}_${Math.round(lng * 100)}`;
            if (!seen.has(key)) {
              seen.add(key);
              const dist = (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng))
                ? Math.round(calculateDistanceKm(userLat, userLng, lat, lng) * 10) / 10
                : undefined;

              results.push({
                id: `geo-nom-${item.osm_id || Math.random().toString(36).substring(2, 9)}`,
                name,
                city,
                state,
                country,
                displayName: item.display_name,
                latitude: lat,
                longitude: lng,
                type: item.type || item.class || 'location',
                distanceKm: dist
              });
            }
          }
        }
      }
    } catch (nomErr) {
      console.warn('Nominatim fallback geocoding error:', nomErr);
    }
  }

  return results;
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

export async function detectIPLocation(): Promise<LocationState | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    const city = data.city || data.locality || data.principalSubdivision || 'Bengaluru';
    const area = data.locality || data.city || 'Nearby Area';
    const lat = data.latitude;
    const lng = data.longitude;
    if (lat && lng) {
      return {
        city,
        area,
        latitude: lat,
        longitude: lng,
        isDetected: false
      };
    }
  } catch (e) {
    console.warn('IP location fetch failed:', e);
  }
  return null;
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
        let detectedCity = '';
        let detectedArea = '';

        // Step 1: Try BigDataCloud Client Reverse Geocode (free, high accuracy, CORS-friendly, zero API key)
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const townOrCity = data.city || data.locality;
            const state = data.principalSubdivision;

            // Extract administrative local district or mandal if available
            let mandalOrSub = '';
            if (data.localityInfo && Array.isArray(data.localityInfo.administrative)) {
              for (const admin of data.localityInfo.administrative) {
                if (admin.order >= 10 && admin.name && !admin.name.toLowerCase().includes('district') && !admin.name.toLowerCase().includes('mandal')) {
                  mandalOrSub = admin.name;
                  break;
                }
              }
            }

            if (townOrCity) {
              detectedCity = townOrCity;
              detectedArea = mandalOrSub || data.locality || townOrCity;
            } else if (state) {
              detectedCity = state;
              detectedArea = data.locality || 'Nearby Region';
            }
          }
        } catch (bdcErr) {
          console.warn('BigDataCloud geocode failed, trying Nominatim fallback:', bdcErr);
        }

        // Step 2: Fallback to OpenStreetMap Nominatim if BigDataCloud did not resolve city
        if (!detectedCity) {
          try {
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

              const localArea =
                address.village ||
                address.town ||
                address.suburb ||
                address.neighbourhood ||
                address.residential ||
                address.city_district;

              let primaryCity =
                address.village ||
                address.town ||
                address.city ||
                (address.county && address.county.toLowerCase().includes('anantapur') ? 'Anantapur' : null) ||
                address.county ||
                address.state_district ||
                '';

              primaryCity = primaryCity.replace(/\s*(District|Urban|Rural|Central City Corporation)$/i, '').trim();
              const displayArea = localArea || `${primaryCity} Central`;

              if (primaryCity) {
                detectedCity = primaryCity;
                detectedArea = displayArea;
              }
            }
          } catch (osmErr) {
            console.warn('Nominatim geocode failed:', osmErr);
          }
        }

        // Step 3: Math-based nearest hub fallback
        if (!detectedCity) {
          let closestHub = KNOWN_HUBS[0];
          let minDistance = Infinity;

          for (const hub of KNOWN_HUBS) {
            const dist = calculateDistanceKm(latitude, longitude, hub.lat, hub.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestHub = hub;
            }
          }

          detectedCity = closestHub.city;
          detectedArea = minDistance <= 30 ? closestHub.area : `Near ${closestHub.city} (${Math.round(minDistance)}km)`;
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
        maximumAge: 30000
      }
    );
  });
}

/**
 * Intelligent multi-word, synonym, category, and token-based place search
 */
export function matchesPlaceSearch(place: Place, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const name = place.name.toLowerCase();
  const city = (place.city || '').toLowerCase();
  const area = (place.area || '').toLowerCase();
  const state = (place.state || '').toLowerCase();
  const desc = (place.description || '').toLowerCase();
  const cat = place.category.toLowerCase();
  const perks = (place.studentPerks || []).join(' ').toLowerCase();

  // Full string substring matches
  if (
    name.includes(q) ||
    city.includes(q) ||
    area.includes(q) ||
    state.includes(q) ||
    desc.includes(q) ||
    cat.includes(q) ||
    perks.includes(q)
  ) {
    return true;
  }

  // Theatre & Cinema intent matching
  const isTheatreQuery = q.includes('theatre') || q.includes('theater') || q.includes('cinema') || q.includes('movie') || q.includes('film') || q.includes('multiplex') || q.includes('screen') || q.includes('fdfs');
  if (isTheatreQuery && (place.category === 'theatres' || name.includes('cinema') || name.includes('theatre') || desc.includes('cinema') || desc.includes('theatre'))) {
    return true;
  }

  // Temple intent matching
  if ((q.includes('temple') || q.includes('mandir') || q.includes('kovil')) && (place.category === 'cultural_temples' || desc.includes('temple') || name.includes('temple'))) {
    return true;
  }

  // Beach intent matching
  if ((q.includes('beach') || q.includes('sea') || q.includes('coast')) && (desc.includes('beach') || name.includes('beach') || place.category === 'viewpoints')) {
    return true;
  }

  // Cafe & Coffee intent matching
  if ((q.includes('cafe') || q.includes('coffee')) && (place.category === 'cafes' || desc.includes('cafe') || desc.includes('coffee') || name.includes('cafe'))) {
    return true;
  }

  // Food & Dining intent matching
  if ((q.includes('food') || q.includes('eat') || q.includes('snack') || q.includes('biryani') || q.includes('dosa') || q.includes('tiffin')) && (place.category === 'street_food' || place.category === 'restaurants')) {
    return true;
  }

  // Tokenized multi-word search (e.g. "theatres in chennai", "chennai movies", "beaches near chennai")
  const stopWords = new Set(['in', 'at', 'near', 'and', 'the', 'of', 'for', 'to', 'with', 'all', 'top', 'best']);
  const tokens = q.split(/\s+/).filter(t => t.length > 1 && !stopWords.has(t));

  if (tokens.length > 1) {
    const allTokensMatch = tokens.every(token => {
      if (name.includes(token) || city.includes(token) || area.includes(token) || state.includes(token) || desc.includes(token) || perks.includes(token)) {
        return true;
      }
      if (['theatre', 'theaters', 'theatres', 'theater', 'cinema', 'cinemas', 'movie', 'movies', 'film', 'films', 'multiplex'].includes(token) && (place.category === 'theatres' || name.includes('cinema') || name.includes('theatre'))) {
        return true;
      }
      if (['temple', 'temples', 'mandir', 'kovil'].includes(token) && (place.category === 'cultural_temples' || name.includes('temple'))) {
        return true;
      }
      if (['beach', 'beaches', 'sea', 'coast', 'ocean'].includes(token) && (name.includes('beach') || desc.includes('beach') || place.category === 'viewpoints')) {
        return true;
      }
      if (['cafe', 'cafes', 'coffee'].includes(token) && (place.category === 'cafes' || name.includes('cafe') || desc.includes('coffee'))) {
        return true;
      }
      if (['park', 'parks', 'garden', 'gardens', 'zoo', 'nature'].includes(token) && (place.category === 'parks_nature' || name.includes('park') || name.includes('garden'))) {
        return true;
      }
      if (['mall', 'malls', 'shopping'].includes(token) && (place.category === 'shopping' || place.category === 'entertainment' || name.includes('mall'))) {
        return true;
      }
      return false;
    });

    if (allTokensMatch) return true;
  }

  return false;
}
