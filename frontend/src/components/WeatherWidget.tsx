import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets } from 'lucide-react';
import { fetchLiveWeather, type WeatherData } from '../utils/weatherService';

interface WeatherWidgetProps {
  city: string;
  lat?: number;
  lng?: number;
  className?: string;
  showAdvice?: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  city,
  lat,
  lng,
  className = '',
  showAdvice = true,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchLiveWeather(city, lat, lng).then((data) => {
      if (isMounted) {
        setWeather(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [city, lat, lng]);

  if (loading || !weather) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400 ${className}`}>
        <CloudSun className="w-3.5 h-3.5 animate-pulse text-amber-400" />
        <span>Loading live weather...</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md ${className}`}>
      <span className="text-base select-none">{weather.icon}</span>
      <span className="text-xs font-bold text-white tracking-tight">{weather.temperature}°C</span>
      <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">{weather.condition}</span>
      
      {weather.humidity !== undefined && (
        <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-slate-400 border-l border-slate-700/80 pl-2">
          <Droplets className="w-2.5 h-2.5 text-blue-400" />
          {weather.humidity}%
        </span>
      )}

      {showAdvice && weather.advice && (
        <span className="hidden lg:inline text-[10px] text-emerald-300/90 border-l border-slate-700/80 pl-2 max-w-[200px] truncate" title={weather.advice}>
          {weather.advice}
        </span>
      )}
    </div>
  );
};
