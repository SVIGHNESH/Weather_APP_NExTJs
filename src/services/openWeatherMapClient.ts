import axios from 'axios';
import { WeatherResponse, CurrentWeather, HourlyData, DailyData } from '../types/weather';

export class OpenWeatherMapClient {
  private baseURL = 'https://api.openweathermap.org/data/2.5/onecall';
  private timeout = 8000;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getWeather(latitude: number, longitude: number): Promise<WeatherResponse> {
    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key not provided');
    }

    try {
      const response = await axios.get(this.baseURL, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric',
          exclude: 'minutely',
        },
        timeout: this.timeout,
      });

      const data = response.data;
      const current = data.current;
      const hourly = data.hourly || [];
      const daily = data.daily || [];

      const currentWeather: CurrentWeather = {
        temperature: current.temp,
        feelsLike: current.feels_like,
        humidity: current.humidity,
        windSpeed: current.wind_speed,
        windDirection: current.wind_deg || 0,
        condition: current.weather?.[0]?.main || 'Unknown',
        conditionCode: current.weather?.[0]?.id || 0,
        pressure: current.pressure,
        uvIndex: current.uvi || 0,
        visibility: current.visibility || 10000,
        precipitation: current.rain?.['1h'] || 0,
        cloudCover: current.clouds,
        timestamp: current.dt,
      };

      const hourlyData: HourlyData[] = hourly
        .slice(0, 48)
        .map((h: any) => ({
          timestamp: h.dt,
          temperature: h.temp,
          feelsLike: h.feels_like,
          condition: h.weather?.[0]?.main || 'Unknown',
          conditionCode: h.weather?.[0]?.id || 0,
          precipitation: h.rain?.['1h'] || 0,
          humidity: h.humidity,
          windSpeed: h.wind_speed,
          pressure: h.pressure,
        }));

      const dailyData: DailyData[] = daily
        .slice(0, 7)
        .map((d: any) => ({
          timestamp: d.dt,
          maxTemperature: d.temp?.max || d.temp,
          minTemperature: d.temp?.min || d.temp,
          condition: d.weather?.[0]?.main || 'Unknown',
          conditionCode: d.weather?.[0]?.id || 0,
          precipitation: d.rain || 0,
          windSpeed: d.wind_speed,
          humidity: d.humidity,
          uvIndex: d.uvi || 0,
        }));

      return {
        current: currentWeather,
        hourly: hourlyData,
        daily: dailyData,
        alerts: data.alerts?.map((alert: any) => ({
          id: alert.event,
          title: alert.event,
          description: alert.description,
          severity: 'moderate',
          start: new Date(alert.start * 1000).toISOString(),
          end: new Date(alert.end * 1000).toISOString(),
        })) || [],
        provider: 'openweathermap',
      };
    } catch (error) {
      throw new Error(`OpenWeatherMap API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
