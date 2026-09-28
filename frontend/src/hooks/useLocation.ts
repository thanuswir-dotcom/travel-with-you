import { useState, useCallback } from 'react';
import type { LocationState } from '../types';

export function useLocation(initialCity = 'Bengaluru', initialArea = 'Church Street & Central') {
  const [location, setLocation] = useState<LocationState>({
    city: initialCity,
    area: initialArea,
    latitude: 12.9749,
    longitude: 77.6082,
    isDetected: false
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          city: 'Current Location',
          area: 'Nearby Your Campus',
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          isDetected: true
        });
        setIsDetecting(false);
      },
      (err) => {
        setError(err.message || 'Could not fetch GPS coordinates');
        setIsDetecting(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  const changeCity = useCallback((city: string, area = 'City Center', lat = 12.9716, lng = 77.5946) => {
    setLocation({
      city,
      area,
      latitude: lat,
      longitude: lng,
      isDetected: false
    });
  }, []);

  return {
    location,
    isDetecting,
    error,
    detectCurrentLocation,
    changeCity,
    setLocation
  };
}
