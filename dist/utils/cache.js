"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
    }
    set(key, data) {
        const now = Date.now();
        this.cache.set(key, {
            data,
            timestamp: now,
            expiresAt: now + this.cacheDuration,
        });
    }
    get(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }
        return {
            ...entry.data,
            cachedAt: entry.timestamp,
        };
    }
    clear() {
        this.cache.clear();
    }
    getCacheKey(lat, lon) {
        return `${lat.toFixed(2)},${lon.toFixed(2)}`;
    }
    getCachedWeather(lat, lon) {
        return this.get(this.getCacheKey(lat, lon));
    }
    setCachedWeather(lat, lon, data) {
        this.set(this.getCacheKey(lat, lon), data);
    }
}
exports.CacheManager = CacheManager;
