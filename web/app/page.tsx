'use client';

import { CurrentWeatherDisplay } from '@/components/CurrentWeatherDisplay';
import { HourlyForecast } from '@/components/HourlyForecast';
import { DailyForecast } from '@/components/DailyForecast';
import { useWeather } from '@/hooks/useWeather';

export default function Home() {
  const { weather, loading, error } = useWeather(40.7128, -74.006); // NYC coordinates

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Weather App</h1>
          <p className="text-gray-600">New York</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <CurrentWeatherDisplay weather={weather} loading={loading} />
        <HourlyForecast weather={weather} loading={loading} />
        <DailyForecast weather={weather} loading={loading} />
      </div>
    </main>
  );
}

