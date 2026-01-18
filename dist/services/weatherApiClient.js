"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherAPIClient = void 0;
const axios_1 = __importDefault(require("axios"));
class WeatherAPIClient {
    constructor(apiKey) {
        this.baseURL = 'https://api.weatherapi.com/v1/forecast.json';
        this.timeout = 8000;
        this.apiKey = apiKey;
    }
    async getWeather(latitude, longitude) {
        if (!this.apiKey) {
            throw new Error('WeatherAPI key not provided');
        }
        try {
            const response = await axios_1.default.get(this.baseURL, {
                params: {
                    key: this.apiKey,
                    q: `${latitude},${longitude}`,
                    days: 10,
                    aqi: 'no',
                },
                timeout: this.timeout,
            });
            const data = response.data;
            const current = data.current;
            const forecast = data.forecast?.forecastday || [];
            const currentWeather = {
                temperature: current.temp_c,
                feelsLike: current.feelslike_c,
                humidity: current.humidity,
                windSpeed: current.wind_kph / 3.6,
                windDirection: current.wind_degree || 0,
                condition: current.condition?.text || 'Unknown',
                conditionCode: current.condition?.code || 0,
                pressure: current.pressure_mb,
                uvIndex: current.uv || 0,
                visibility: current.vis_km * 1000,
                precipitation: current.precip_mm,
                cloudCover: current.cloud,
                timestamp: Math.floor(new Date(current.last_updated).getTime() / 1000),
            };
            const hourlyData = [];
            forecast.slice(0, 2).forEach((day) => {
                day.hour.forEach((hour) => {
                    if (hourlyData.length < 48) {
                        hourlyData.push({
                            timestamp: Math.floor(new Date(hour.time).getTime() / 1000),
                            temperature: hour.temp_c,
                            feelsLike: hour.feelslike_c,
                            condition: hour.condition?.text || 'Unknown',
                            conditionCode: hour.condition?.code || 0,
                            precipitation: hour.precip_mm,
                            humidity: hour.humidity,
                            windSpeed: hour.wind_kph / 3.6,
                            pressure: hour.pressure_mb,
                        });
                    }
                });
            });
            const dailyData = forecast
                .slice(0, 7)
                .map((day) => ({
                timestamp: Math.floor(new Date(day.date).getTime() / 1000),
                maxTemperature: day.day.maxtemp_c,
                minTemperature: day.day.mintemp_c,
                condition: day.day.condition?.text || 'Unknown',
                conditionCode: day.day.condition?.code || 0,
                precipitation: day.day.totalprecip_mm,
                windSpeed: day.day.maxwind_kph / 3.6,
                humidity: day.day.avg_humidity,
                uvIndex: day.day.uv || 0,
            }));
            return {
                current: currentWeather,
                hourly: hourlyData,
                daily: dailyData,
                alerts: data.alerts?.alert?.map((alert) => ({
                    id: alert.headline,
                    title: alert.headline,
                    description: alert.desc,
                    severity: 'moderate',
                    start: alert.effective,
                    end: alert.expires,
                })) || [],
                provider: 'weatherapi',
            };
        }
        catch (error) {
            throw new Error(`WeatherAPI error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.WeatherAPIClient = WeatherAPIClient;
