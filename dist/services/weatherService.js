"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const openMeteoClient_1 = require("./openMeteoClient");
const openWeatherMapClient_1 = require("./openWeatherMapClient");
const weatherApiClient_1 = require("./weatherApiClient");
const cache_1 = require("../utils/cache");
class WeatherService {
    constructor(openWeatherMapKey, weatherAPIKey) {
        this.openMeteoClient = new openMeteoClient_1.OpenMeteoClient();
        this.openWeatherMapClient = new openWeatherMapClient_1.OpenWeatherMapClient(openWeatherMapKey || '');
        this.weatherAPIClient = new weatherApiClient_1.WeatherAPIClient(weatherAPIKey || '');
        this.cacheManager = new cache_1.CacheManager();
    }
    async getWeather(latitude, longitude) {
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
        }
        catch (error) {
            console.warn('Open-Meteo failed, trying OpenWeatherMap:', error instanceof Error ? error.message : error);
        }
        try {
            const result = await this.openWeatherMapClient.getWeather(latitude, longitude);
            this.cacheManager.setCachedWeather(latitude, longitude, result);
            return result;
        }
        catch (error) {
            console.warn('OpenWeatherMap failed, trying WeatherAPI:', error instanceof Error ? error.message : error);
        }
        try {
            const result = await this.weatherAPIClient.getWeather(latitude, longitude);
            this.cacheManager.setCachedWeather(latitude, longitude, result);
            return result;
        }
        catch (error) {
            console.error('WeatherAPI failed:', error instanceof Error ? error.message : error);
        }
        throw new Error('All weather providers failed. Unable to fetch weather data.');
    }
}
exports.WeatherService = WeatherService;
