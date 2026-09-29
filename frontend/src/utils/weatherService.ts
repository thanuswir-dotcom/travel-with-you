// Open-Meteo Free Live Weather Service for Travel With You
export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  advice: string;
  humidity?: number;
  windSpeed?: number;
}

const WEATHER_CACHE: Record<string, { data: WeatherData; timestamp: number }> = {};
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 mins

// Fallback city coordinates across major Indian travel hubs
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  goa: { lat: 15.2993, lng: 74.1240 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  ooty: { lat: 11.4102, lng: 76.6950 },
  munnar: { lat: 10.0889, lng: 77.0595 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  puducherry: { lat: 11.9416, lng: 79.8083 },
  pondicherry: { lat: 11.9416, lng: 79.8083 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  vizag: { lat: 17.6868, lng: 83.2185 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  leh: { lat: 34.1526, lng: 77.5771 },
  araku: { lat: 18.3273, lng: 82.8775 },
};

function parseWmoCode(code: number): { condition: string; icon: string; advice: string } {
  if (code === 0) {
    return { condition: 'Sunny & Clear', icon: '☀️', advice: 'Great day for outdoor exploration & beach outings!' };
  }
  if ([1, 2, 3].includes(code)) {
    return { condition: 'Partly Cloudy', icon: '⛅', advice: 'Pleasant weather for cafe hopping & photo walks!' };
  }
  if ([45, 48].includes(code)) {
    return { condition: 'Misty / Foggy', icon: '🌫️', advice: 'Scenic mist, perfect for scenic viewpoints & hot tea.' };
  }
  if ([51, 53, 55, 61, 63, 65].includes(code)) {
    return { condition: 'Light Rain', icon: '🌧️', advice: 'Carry an umbrella or check out cosy indoor cafes & theatres!' };
  }
  if ([80, 81, 82].includes(code)) {
    return { condition: 'Rain Showers', icon: '🌦️', advice: 'Passing showers — perfect for museum tours or indoor gaming.' };
  }
  if ([95, 96, 99].includes(code)) {
    return { condition: 'Thunderstorm', icon: '⛈️', advice: 'Heavy rain alert: Plan indoor activities and stay safe!' };
  }
  return { condition: 'Pleasant', icon: '🌤️', advice: 'Great weather to explore new spots with friends.' };
}

export async function fetchLiveWeather(city: string, lat?: number, lng?: number): Promise<WeatherData | null> {
  const normCity = city.trim().toLowerCase();
  const cacheKey = `${normCity}_${lat?.toFixed(2)}_${lng?.toFixed(2)}`;

  if (WEATHER_CACHE[cacheKey] && Date.now() - WEATHER_CACHE[cacheKey].timestamp < CACHE_DURATION_MS) {
    return WEATHER_CACHE[cacheKey].data;
  }

  let targetLat = lat;
  let targetLng = lng;

  if (!targetLat || !targetLng) {
    const coords = CITY_COORDS[normCity] || CITY_COORDS.chennai;
    targetLat = coords.lat;
    targetLng = coords.lng;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetLat}&longitude=${targetLng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Weather API error');
    const json = await res.json();
    const cur = json.current;

    const { condition, icon, advice } = parseWmoCode(cur.weather_code);
    const data: WeatherData = {
      temperature: Math.round(cur.temperature_2m),
      condition,
      icon,
      advice,
      humidity: Math.round(cur.relative_humidity_2m),
      windSpeed: Math.round(cur.wind_speed_10m),
    };

    WEATHER_CACHE[cacheKey] = { data, timestamp: Date.now() };
    return data;
  } catch (err) {
    // Graceful offline fallback based on city defaults
    const fallback: WeatherData = {
      temperature: 28,
      condition: 'Warm & Sunny',
      icon: '☀️',
      advice: 'Great day for squad exploration and hanging out!',
      humidity: 65,
      windSpeed: 12,
    };
    return fallback;
  }
}
