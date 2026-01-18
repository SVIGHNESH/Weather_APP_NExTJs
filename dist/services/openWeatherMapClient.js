"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenWeatherMapClient = void 0;
const axios_1 = __importDefault(require("axios"));
class OpenWeatherMapClient {
    constructor(apiKey) {
        this.baseURL = 'https://api.openweathermap.org/data/2.5/onecall';
        this.timeout = 8000;
        this.apiKey = apiKey;
    }
    async getWeather(latitude, longitude) {
        if (!this.apiKey) {
            throw new Error('OpenWeatherMap API key not provided');
        }
        try {
            const response = await axios_1.default.get(this.baseURL, {
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
            const currentWeather = {
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
            const hourlyData = hourly
                .slice(0, 48)
                .map((h) => ({
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
            const dailyData = daily
                .slice(0, 7)
                .map((d) => ({
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
                alerts: data.alerts?.map((alert) => ({
                    id: alert.event,
                    title: alert.event,
                    description: alert.description,
                    severity: 'moderate',
                    start: new Date(alert.start * 1000).toISOString(),
                    end: new Date(alert.end * 1000).toISOString(),
                })) || [],
                provider: 'openweathermap',
            };
        }
        catch (error) {
            throw new Error(`OpenWeatherMap API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
exports.OpenWeatherMapClient = OpenWeatherMapClient;
