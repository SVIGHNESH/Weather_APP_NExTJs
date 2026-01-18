'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { useWeatherCache, formatLastUpdated } from './useWeatherCache';

export const useWeather = (latitude: number, longitude: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOffline, lastUpdated, isCached, getCachedData, setCacheData } = useWeatherCache(latitude, longitude);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch fresh data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/weather?lat=${latitude}&lon=${longitude}`,
          { signal: AbortSignal.timeout(8000) } // 8 second timeout
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);
        setCacheData(data);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'An error occurred';
        
        // Try to use cached data if available
        const cachedData = getCachedData();
        if (cachedData) {
          setWeather(cachedData);
          setError(isOffline ? 'Offline: showing cached data' : `Failed to fetch weather: ${errorMsg}. Showing cached data.`);
        } else {
          setError(isOffline ? 'Offline: no cached data available' : errorMsg);
          setWeather(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude, setCacheData, getCachedData, isOffline]);

  const lastUpdatedTime = lastUpdated ? formatLastUpdated(lastUpdated) : null;

  return { weather, loading, error, isOffline, isCached, lastUpdated: lastUpdatedTime };
};
