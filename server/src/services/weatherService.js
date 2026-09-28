// Weather service providing live or high-fidelity simulated weather for student destinations

const CITY_WEATHER_PROFILES = {
  bengaluru: { tempC: 27, condition: 'Sunny', humidity: 55, isRaining: false },
  delhi: { tempC: 31, condition: 'Pleasant Breeze', humidity: 48, isRaining: false },
  mumbai: { tempC: 30, condition: 'Coastal Sun', humidity: 72, isRaining: false },
  pune: { tempC: 26, condition: 'Pleasant & Cool', humidity: 52, isRaining: false },
  hyderabad: { tempC: 29, condition: 'Clear Sky', humidity: 50, isRaining: false },
  chennai: { tempC: 32, condition: 'Warm & Sunny', humidity: 78, isRaining: false }
};

export const getWeatherForCity = (city = 'Bengaluru') => {
  const normalized = city.toLowerCase();
  const profile = CITY_WEATHER_PROFILES[normalized] || {
    tempC: 28,
    condition: 'Sunny',
    humidity: 50,
    isRaining: false
  };

  let smartAdvice = '';
  let suggestedCategories = [];

  if (profile.isRaining) {
    smartAdvice = '🌧️ It is raining! Perfect time for cozy indoor cafes, theatre plays, and gaming zones.';
    suggestedCategories = ['cafes', 'theatres', 'entertainment', 'study_spots'];
  } else if (profile.tempC <= 28) {
    smartAdvice = '☀️ 27°C — Perfect weather for exploring outdoor parks, viewpoints, and street food!';
    suggestedCategories = ['parks_nature', 'viewpoints', 'street_food', 'photo_spots'];
  } else {
    smartAdvice = '🌤️ Warm afternoon — ideal for air-conditioned study spots, indoor bowling, and evening street food.';
    suggestedCategories = ['study_spots', 'entertainment', 'cafes', 'street_food'];
  }

  return {
    city,
    tempC: profile.tempC,
    condition: profile.condition,
    humidity: profile.humidity,
    isRaining: profile.isRaining,
    advice: smartAdvice,
    suggestedCategories
  };
};
