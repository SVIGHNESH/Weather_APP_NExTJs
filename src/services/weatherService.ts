import { OpenMeteoClient } from './openMeteoClient';
import { OpenWeatherMapClient } from './openWeatherMapClient';
import { WeatherAPIClient } from './weatherApiClient';
import { WeatherResponse } from '../types/weather';
import { CacheManager } from '../utils/cache';

export class WeatherService {
  private openMeteoClient: OpenMeteoClient;
  private openWeatherMapClient: OpenWeatherMapClient;
  private weatherAPIClient: WeatherAPIClient;
  private cacheManager: CacheManager;

  constructor(
    openWeatherMapKey?: string,
    weatherAPIKey?: string,
  ) {
    this.openMeteoClient = new OpenMeteoClient();
    this.openWeatherMapClient = new OpenWeatherMapClient(openWeatherMapKey || '');
    this.weatherAPIClient = new WeatherAPIClient(weatherAPIKey || '');
    this.cacheManager = new CacheManager();
  }

  async getWeather(latitude: number, longitude: number): Promise<WeatherResponse> {
    // Check cache first
    const cached = this.cacheManager.getCachedWeather(latitude, longitude);
    if (cached) {
      return cached;
    }

    // Fallback chain: Open-Meteo → OpenWeatherMap → WeatherAPI
    try {
      const result = await this.openMeteoClient.getWeather(latitude, longitude);
      this.cacheManager.setCachedWeather(latitude, longitude, result);
      return result;
    } catch (error) {
      console.warn('Open-Meteo failed, trying OpenWeatherMap:', error instanceof Error ? error.message : error);
    }

    try {
      const result = await this.openWeatherMapClient.getWeather(latitude, longitude);
      this.cacheManager.setCachedWeather(latitude, longitude, result);
      return result;
    } catch (error) {
      console.warn('OpenWeatherMap failed, trying WeatherAPI:', error instanceof Error ? error.message : error);
    }

    try {
      const result = await this.weatherAPIClient.getWeather(latitude, longitude);
      this.cacheManager.setCachedWeather(latitude, longitude, result);
      return result;
    } catch (error) {
      console.error('WeatherAPI failed:', error instanceof Error ? error.message : error);
    }

    throw new Error('All weather providers failed. Unable to fetch weather data.');
  }
}
