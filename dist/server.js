"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const weatherService_1 = require("./services/weatherService");
const auth_1 = __importDefault(require("./routes/auth"));
const locations_1 = __importDefault(require("./routes/locations"));
const app = (0, express_1.default)();
const weatherService = new weatherService_1.WeatherService(process.env.OPENWEATHERMAP_API_KEY, process.env.WEATHERAPI_KEY);
app.use(express_1.default.json());
app.use('/api/auth', auth_1.default);
app.use('/api/locations', locations_1.default);
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({
                error: 'Missing required parameters: lat and lon',
            });
        }
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                error: 'Invalid latitude or longitude',
            });
        }
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({
                error: 'Latitude must be between -90 and 90, longitude between -180 and 180',
            });
        }
        const weather = await weatherService.getWeather(latitude, longitude);
        return res.json(weather);
    }
    catch (error) {
        console.error('Error fetching weather:', error);
        return res.status(503).json({
            error: 'Service Unavailable',
            message: error instanceof Error ? error.message : 'Unable to fetch weather data from any provider',
        });
    }
});
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Weather API server running on port ${PORT}`);
});
exports.default = app;
