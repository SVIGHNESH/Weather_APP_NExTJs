'use client';

import React, { useState, useRef } from 'react';
import { WeatherData } from '@/types/weather';

interface HourlyForecastProps {
  weather: WeatherData | null;
  loading: boolean;
}

export function HourlyForecast({ weather, loading }: HourlyForecastProps) {
  const [hoursToShow, setHoursToShow] = useState<24 | 48>(24);
  const [selectedHourIndex, setSelectedHourIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-48"></div>
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 bg-gray-100 rounded-lg p-4 w-20 h-24">
              <div className="bg-gray-200 h-4 rounded animate-pulse mb-2"></div>
              <div className="bg-gray-200 h-6 rounded animate-pulse mb-2"></div>
              <div className="bg-gray-200 h-3 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!weather || !weather.hourly || weather.hourly.length === 0) {
    return null;
  }

  const currentHour = new Date().getHours();
  const displayedHours = weather.hourly.slice(0, hoursToShow);
  const selectedHour = selectedHourIndex !== null ? displayedHours[selectedHourIndex] : null;

  // Get emoji for weather condition
  const getWeatherEmoji = (condition: string): string => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sunny')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain')) return '🌧️';
    if (lower.includes('snow')) return '❄️';
    if (lower.includes('storm') || lower.includes('thunder')) return '⛈️';
    if (lower.includes('fog') || lower.includes('mist')) return '🌫️';
    if (lower.includes('overcast')) return '☁️';
    if (lower.includes('partly')) return '⛅';
    return '🌤️';
  };

  // Parse hour from ISO string
  const getHourFromTime = (timeStr: string): number => {
    const date = new Date(timeStr);
    return date.getHours();
  };

  // Format time display (e.g., "3 PM", "12 AM")
  const formatTimeDisplay = (timeStr: string): string => {
    const date = new Date(timeStr);
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours} ${ampm}`;
  };

  // Determine if this hour is the current hour
  const isCurrentHour = (timeStr: string): boolean => {
    const hourFromTime = getHourFromTime(timeStr);
    return hourFromTime === currentHour;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header with title and mode toggle */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Hourly Forecast</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setHoursToShow(24)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              hoursToShow === 24
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setHoursToShow(48)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              hoursToShow === 48
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            48h
          </button>
        </div>
      </div>

      {/* Horizontal scrollable hourly list */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {displayedHours.map((hour, index) => {
          const isSelected = selectedHourIndex === index;
          const isCurrent = isCurrentHour(hour.time);

          return (
            <button
              key={`${hour.time}-${index}`}
              onClick={() => setSelectedHourIndex(isSelected ? null : index)}
              className={`flex-shrink-0 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                isCurrent
                  ? 'bg-gradient-to-b from-blue-400 to-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                  : isSelected
                    ? 'bg-blue-50 border-2 border-blue-500 text-gray-800'
                    : 'bg-gray-50 border border-gray-200 text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className="w-20 text-center">
                {/* Time */}
                <div className="text-xs font-semibold mb-2 opacity-90">
                  {formatTimeDisplay(hour.time)}
                </div>

                {/* Weather emoji */}
                <div className="text-2xl mb-2">{getWeatherEmoji(hour.condition)}</div>

                {/* Temperature */}
                <div className="text-sm font-bold mb-1">
                  {Math.round(hour.temperature)}°
                </div>

                {/* Precipitation probability */}
                <div className="text-xs opacity-75">
                  💧 {hour.precipitationProbability}%
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed info for selected hour */}
      {selectedHour && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500 animate-in fade-in duration-200">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Time</p>
              <p className="text-lg font-semibold text-gray-800">
                {formatTimeDisplay(selectedHour.time)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Temperature</p>
              <p className="text-lg font-semibold text-gray-800">
                {Math.round(selectedHour.temperature)}°C
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Precipitation</p>
              <p className="text-lg font-semibold text-gray-800">
                {selectedHour.precipitationProbability}%
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-3">
            <span className="font-semibold">{selectedHour.condition}</span>
          </p>
        </div>
      )}

      {/* CSS for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
