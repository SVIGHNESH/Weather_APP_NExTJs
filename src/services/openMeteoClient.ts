import axios from 'axios';
import { WeatherResponse, CurrentWeather, HourlyData, DailyData } from '../types/weather';

export class OpenMeteoClient {
  private baseURL = 'https://api.open-meteo.com/v1/forecast';
  private timeout = 8000;

  async getWeather(latitude: number, longitude: number): Promise<WeatherResponse> {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,visibility',
          hourly: 'temperature_2m,apparent_temperature,weather_code,precipitation,relative_humidity_2m,wind_speed_10m,pressure_msl',
          daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_max,uv_index_max',
          timezone: 'auto',
        },
        timeout: this.timeout,
      });

      const data = response.data;
      const current = data.current;
      const hourly = data.hourly;
      const daily = data.daily;

      const currentWeather: CurrentWeather = {
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        condition: this.mapWeatherCode(current.weather_code),
        conditionCode: current.weather_code,
        pressure: current.pressure_msl,
        uvIndex: daily.uv_index_max[0] || 0,
        visibility: current.visibility || 10000,
        precipitation: 0,
        cloudCover: current.cloud_cover,
        timestamp: new Date(current.time).getTime() / 1000,
      };

      const hourlyData: HourlyData[] = hourly.time.map((time: string, idx: number) => ({
        timestamp: new Date(time).getTime() / 1000,
        temperature: hourly.temperature_2m[idx],
        feelsLike: hourly.apparent_temperature[idx],
        condition: this.mapWeatherCode(hourly.weather_code[idx]),
        conditionCode: hourly.weather_code[idx],
        precipitation: hourly.precipitation[idx] || 0,
        humidity: hourly.relative_humidity_2m[idx],
        windSpeed: hourly.wind_speed_10m[idx],
        pressure: hourly.pressure_msl[idx],
      })).slice(0, 48);

      const dailyData: DailyData[] = daily.time.map((time: string, idx: number) => ({
        timestamp: new Date(time).getTime() / 1000,
        maxTemperature: daily.temperature_2m_max[idx],
        minTemperature: daily.temperature_2m_min[idx],
        condition: this.mapWeatherCode(daily.weather_code[idx]),
        conditionCode: daily.weather_code[idx],
        precipitation: daily.precipitation_sum[idx] || 0,
        windSpeed: daily.wind_speed_10m_max[idx],
        humidity: daily.relative_humidity_2m_max[idx],
        uvIndex: daily.uv_index_max[idx] || 0,
      })).slice(0, 7);

      return {
        current: currentWeather,
        hourly: hourlyData,
        daily: dailyData,
        alerts: [],
        provider: 'open-meteo',
      };
    } catch (error) {
      throw new Error(`Open-Meteo API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private mapWeatherCode(code: number): string {
    const codeMap: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return codeMap[code] || 'Unknown';
  }
}
