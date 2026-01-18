'use client';

import { useState } from 'react';
import { CurrentWeatherDisplay } from '@/components/CurrentWeatherDisplay';
import { HourlyForecast } from '@/components/HourlyForecast';
import { DailyForecast } from '@/components/DailyForecast';
import { WeatherMap } from '@/components/WeatherMap';
import { SettingsPanel } from '@/components/SettingsPanel';
import { LocationSearch } from '@/components/LocationSearch';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { LocationSuggestion } from '@/hooks/useLocationSearch';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'weather' | 'map'>('weather');
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const geolocation = useGeolocation();
  
  const latitude = selectedLocation?.latitude ?? geolocation.latitude;
  const longitude = selectedLocation?.longitude ?? geolocation.longitude;
  const { weather, loading, error } = useWeather(latitude, longitude);

  const locationName = selectedLocation?.name ?? (geolocation.permissionGranted ? 'Current Location' : 'New York (Default)');

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSelectedLocation(location);
    setShowLocationSearch(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Weather App</h1>
            <p className="text-gray-600">{locationName}</p>
          </div>
          <button
            onClick={() => setShowLocationSearch(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            title="Search locations"
          >
            🔍 Search
          </button>
        </div>

        {geolocation.error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            {geolocation.error}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'weather'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Weather
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'map'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Map
          </button>
        </div>

        {/* Weather view */}
        {activeTab === 'weather' && (
          <>
            <CurrentWeatherDisplay weather={weather} loading={loading} />
            <HourlyForecast weather={weather} loading={loading} />
            <DailyForecast weather={weather} loading={loading} />
          </>
        )}

        {/* Map view */}
        {activeTab === 'map' && (
          <WeatherMap weather={weather} loading={loading} latitude={latitude} longitude={longitude} />
        )}
      </div>

      {/* Location search modal */}
      {showLocationSearch && (
        <LocationSearch
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationSearch(false)}
        />
      )}

      {/* Settings panel */}
      <SettingsPanel
        onEnableLocation={geolocation.requestPermissionAgain}
        locationDenied={geolocation.error ? true : false}
      />
    </main>
  );
}

