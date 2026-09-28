import { useState, useEffect } from 'react';
import { fetchWeather } from '../utils/api';

export interface WeatherData {
  city: string;
  tempC: number;
  condition: string;
  humidity: number;
  isRaining: boolean;
  advice: string;
  suggestedCategories: string[];
}

export function useWeather(city = 'Bengaluru') {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchWeather(city)
      .then((data: WeatherData | null) => {
        if (isMounted) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not load weather');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [city]);

  return { weather, loading, error };
}
