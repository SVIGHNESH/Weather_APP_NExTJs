import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '@/types/weather';

interface CachedWeatherData {
  data: WeatherData;
  timestamp: number;
  expiresAt: number;
}

const CACHE_KEY_PREFIX = 'weather_cache_';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export function useWeatherCache(lat: number, lon: number) {
  const [isOffline, setIsOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isCached, setIsCached] = useState(false);

  // Generate cache key based on coordinates
  const getCacheKey = useCallback((latitude: number, longitude: number) => {
    const roundedLat = Math.round(latitude * 100) / 100;
    const roundedLon = Math.round(longitude * 100) / 100;
    return `${CACHE_KEY_PREFIX}${roundedLat}_${roundedLon}`;
  }, []);

  // Get cached data
  const getCachedData = useCallback((): WeatherData | null => {
    try {
      const cacheKey = getCacheKey(lat, lon);
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }

      const cachedEntry: CachedWeatherData = JSON.parse(cached);
      
      // Check if cache has expired
      if (Date.now() > cachedEntry.expiresAt) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      setLastUpdated(cachedEntry.timestamp);
      setIsCached(true);
      return cachedEntry.data;
    } catch (error) {
      console.error('Failed to retrieve cached weather data:', error);
      return null;
    }
  }, [lat, lon, getCacheKey]);

  // Cache data
  const setCacheData = useCallback((data: WeatherData) => {
    try {
      const cacheKey = getCacheKey(lat, lon);
      const timestamp = Date.now();
      const cachedEntry: CachedWeatherData = {
        data,
        timestamp,
        expiresAt: timestamp + CACHE_DURATION,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cachedEntry));
      setLastUpdated(timestamp);
      setIsCached(true);
    } catch (error) {
      console.error('Failed to cache weather data:', error);
    }
  }, [lat, lon, getCacheKey]);

  // Clear cache
  const clearCache = useCallback((latitude?: number, longitude?: number) => {
    try {
      if (latitude !== undefined && longitude !== undefined) {
        const cacheKey = getCacheKey(latitude, longitude);
        localStorage.removeItem(cacheKey);
      } else {
        // Clear all weather cache entries
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_KEY_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }, [getCacheKey]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial online status
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOffline,
    lastUpdated,
    isCached,
    getCachedData,
    setCacheData,
    clearCache,
  };
}

// Format timestamp for display
export function formatLastUpdated(timestamp: number | null): string {
  if (!timestamp) return 'Unknown';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric',
    minute: '2-digit'
  });
}
