import express, { Request, Response } from 'express';
import { WeatherService } from './services/weatherService';
import authRoutes from './routes/auth';
import locationsRoutes from './routes/locations';

const app = express();
const weatherService = new WeatherService(
  process.env.OPENWEATHERMAP_API_KEY,
  process.env.WEATHERAPI_KEY,
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Weather API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
      },
      locations: {
        list: 'GET /api/locations',
        create: 'POST /api/locations',
        update: 'PATCH /api/locations/:id',
        delete: 'DELETE /api/locations/:id',
      },
      weather: 'GET /api/weather?lat={latitude}&lon={longitude}',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationsRoutes);

app.get('/api/weather', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        error: 'Missing required parameters: lat and lon',
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

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
  } catch (error) {
    console.error('Error fetching weather:', error);
    return res.status(503).json({
      error: 'Service Unavailable',
      message: error instanceof Error ? error.message : 'Unable to fetch weather data from any provider',
    });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Weather API server running on port ${PORT}`);
});

export default app;
