import { useState, useEffect, useCallback } from 'react';
import { toggleSavePlaceBackend } from '../utils/api';

const STORAGE_KEY = 'twy_saved_places';

export function useSavedPlaces(initialIds: string[] = []) {
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((id: string) => !['p-1', 'p-2', 'p-13', 'blr-cafe-1', 'blr-study-1'].includes(id));
        }
      }
    } catch {}
    return initialIds;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPlaceIds));
    } catch (e) {
      console.error('Failed to sync saved places to localStorage', e);
    }
  }, [savedPlaceIds]);

  const toggleSave = useCallback(async (placeId: string) => {
    setSavedPlaceIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );

    try {
      await toggleSavePlaceBackend(placeId);
    } catch (err) {
      console.warn('Backend sync failed, state preserved locally', err);
    }
  }, []);

  const isSaved = useCallback((placeId: string) => savedPlaceIds.includes(placeId), [savedPlaceIds]);

  return {
    savedPlaceIds,
    toggleSave,
    isSaved,
    setSavedPlaceIds
  };
}
