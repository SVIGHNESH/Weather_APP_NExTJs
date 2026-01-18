import { WeatherResponse, CacheEntry } from '../types/weather';

export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private cacheDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

  set(key: string, data: WeatherResponse): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.cacheDuration,
    });
  }

  get(key: string): WeatherResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return {
      ...entry.data,
      cachedAt: entry.timestamp,
    };
  }

  clear(): void {
    this.cache.clear();
  }

  private getCacheKey(lat: number, lon: number): string {
    return `${lat.toFixed(2)},${lon.toFixed(2)}`;
  }

  getCachedWeather(lat: number, lon: number): WeatherResponse | null {
    return this.get(this.getCacheKey(lat, lon));
  }

  setCachedWeather(lat: number, lon: number, data: WeatherResponse): void {
    this.set(this.getCacheKey(lat, lon), data);
  }
}
