'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData } from '@/types/weather';
import { useSettings } from '@/hooks/useSettings';

interface CurrentWeatherDisplayProps {
  weather: WeatherData | null;
  loading: boolean;
}

const getWeatherIcon = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('rain')) return '🌧️';
  if (conditionLower.includes('cloud')) return '☁️';
  if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('wind')) return '💨';
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
  return '🌤️';
};

export const CurrentWeatherDisplay: React.FC<CurrentWeatherDisplayProps> = ({
  weather,
  loading,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { formatTemperature, formatSpeed, formatPressure } = useSettings();

  useEffect(() => {
    if (weather) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [weather]);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-b from-blue-400 to-blue-300 rounded-3xl p-8 mb-6 animate-pulse">
        <div className="h-40 bg-blue-200 rounded-2xl mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-blue-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="w-full bg-gradient-to-b from-gray-300 to-gray-200 rounded-3xl p-8 mb-6 text-center">
        <p className="text-gray-600">No weather data available</p>
      </div>
    );
  }

  const { temperature, feelsLike, condition, humidity, windSpeed, pressure, uvIndex, visibility } =
    weather.current;

  const icon = getWeatherIcon(condition);

  return (
    <div
      className={`w-full bg-gradient-to-b from-blue-400 to-blue-300 rounded-3xl p-8 mb-6 transition-all duration-500 ${
        isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
      }`}
    >
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <span className="text-8xl animate-bounce">{icon}</span>
        </div>

        <div className="mb-4">
          <div className="text-7xl font-bold text-white mb-2">{formatTemperature(temperature)}</div>
          <p className="text-xl text-blue-50">
            Feels like <span className="font-semibold">{formatTemperature(feelsLike)}</span>
          </p>
          <p className="text-lg text-blue-100 mt-2 capitalize">{condition}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm hover:bg-opacity-30 transition-all">
          <div className="text-sm text-blue-50 font-medium">Humidity</div>
          <div className="text-3xl font-bold text-white mt-2">{humidity}%</div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm hover:bg-opacity-30 transition-all">
          <div className="text-sm text-blue-50 font-medium">Wind Speed</div>
          <div className="text-3xl font-bold text-white mt-2">{formatSpeed(windSpeed)}</div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm hover:bg-opacity-30 transition-all">
          <div className="text-sm text-blue-50 font-medium">Pressure</div>
          <div className="text-3xl font-bold text-white mt-2">{formatPressure(pressure)}</div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm hover:bg-opacity-30 transition-all">
          <div className="text-sm text-blue-50 font-medium">UV Index</div>
          <div className="text-3xl font-bold text-white mt-2">{uvIndex}</div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm hover:bg-opacity-30 transition-all">
          <div className="text-sm text-blue-50 font-medium">Visibility</div>
          <div className="text-3xl font-bold text-white mt-2">{Math.round(visibility / 1000)} km</div>
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm hover:bg-opacity-30 transition-all">
          <div className="text-sm text-blue-50 font-medium">Feels Like</div>
          <div className="text-3xl font-bold text-white mt-2">{formatTemperature(feelsLike)}</div>
        </div>
      </div>
    </div>
  );
};
