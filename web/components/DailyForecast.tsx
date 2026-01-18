'use client';

import React, { useState } from 'react';
import { WeatherData } from '@/types/weather';

interface DailyForecastProps {
  weather: WeatherData | null;
  loading: boolean;
}

export function DailyForecast({ weather, loading }: DailyForecastProps) {
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse mb-4 w-48"></div>
        <div className="space-y-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 h-24 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!weather || !weather.daily || weather.daily.length === 0) {
    return null;
  }

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

  // Format date to day name (e.g., "Monday", "Tomorrow")
  const formatDayName = (dateStr: string, index: number): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time to 00:00 for comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      return 'Today';
    } else if (date.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  // Get hourly data for a specific day
  const getHourlyDataForDay = (dateStr: string) => {
    if (!weather.hourly) return [];
    const dayDate = new Date(dateStr);
    dayDate.setHours(0, 0, 0, 0);

    return weather.hourly.filter(hour => {
      const hourDate = new Date(hour.time);
      hourDate.setHours(0, 0, 0, 0);
      return hourDate.getTime() === dayDate.getTime();
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">7-Day Forecast</h2>

      <div className="space-y-2">
        {weather.daily.map((day, index) => {
          const isExpanded = expandedDayIndex === index;
          const hourlyData = getHourlyDataForDay(day.date);

          return (
            <div key={`${day.date}-${index}`} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Daily card header */}
              <button
                onClick={() =>
                  setExpandedDayIndex(isExpanded ? null : index)
                }
                className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-colors text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Day name */}
                  <div className="w-24">
                    <p className="font-semibold text-gray-800">
                      {formatDayName(day.date, index)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Weather emoji and condition */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getWeatherEmoji(day.condition)}</span>
                    <p className="text-sm text-gray-700 max-w-xs truncate">
                      {day.condition}
                    </p>
                  </div>
                </div>

                {/* High/Low temps and precipitation */}
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">High / Low</p>
                    <p className="font-semibold text-gray-800">
                      {Math.round(day.high)}° / {Math.round(day.low)}°
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Precipitation</p>
                    <p className="font-semibold text-gray-800">
                      {day.precipitationChance}%
                    </p>
                  </div>

                  {/* Expand/collapse icon */}
                  <div
                    className={`text-gray-600 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </div>
                </div>
              </button>

              {/* Hourly breakdown for expanded day */}
              {isExpanded && hourlyData.length > 0 && (
                <div className="bg-blue-50 p-4 border-t border-gray-200 animate-in fade-in duration-300">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Hourly Breakdown
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {hourlyData.map((hour, idx) => {
                      const hourDate = new Date(hour.time);
                      const hourDisplay = hourDate.getHours() % 12 || 12;
                      const ampm = hourDate.getHours() >= 12 ? 'PM' : 'AM';

                      return (
                        <div
                          key={`${hour.time}-${idx}`}
                          className="bg-white rounded-lg p-2 text-center border border-gray-200"
                        >
                          <p className="text-xs text-gray-600 font-medium">
                            {hourDisplay} {ampm}
                          </p>
                          <p className="text-lg my-1">
                            {getWeatherEmoji(hour.condition)}
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {Math.round(hour.temperature)}°
                          </p>
                          <p className="text-xs text-gray-600">
                            💧 {hour.precipitationProbability}%
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
