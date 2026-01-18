export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'extreme' | 'severe' | 'moderate' | 'minor';
  start: string;
  end: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  condition: string;
  conditionCode: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  precipitation: number;
  cloudCover: number;
  timestamp: number;
}

export interface HourlyData {
  timestamp: number;
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionCode: number;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

export interface DailyData {
  timestamp: number;
  maxTemperature: number;
  minTemperature: number;
  condition: string;
  conditionCode: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
}

export interface WeatherResponse {
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: DailyData[];
  alerts: WeatherAlert[];
  provider: 'open-meteo' | 'openweathermap' | 'weatherapi';
  cachedAt?: number;
}

export interface CacheEntry {
  data: WeatherResponse;
  timestamp: number;
  expiresAt: number;
}
