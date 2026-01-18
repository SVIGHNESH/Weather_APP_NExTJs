'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherData } from '@/types/weather';

interface WeatherMapProps {
  weather: WeatherData | null;
  loading: boolean;
  latitude?: number;
  longitude?: number;
}

interface MapInstance {
  map: L.Map | null;
  cloudLayer: L.TileLayer | null;
  locationMarker: L.Marker | null;
  alertPopups: L.LayerGroup | null;
  refreshInterval: NodeJS.Timeout | null;
}

export function WeatherMap({ weather, loading, latitude = 40.7128, longitude = -74.006 }: WeatherMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapInstance>({
    map: null,
    cloudLayer: null,
    locationMarker: null,
    alertPopups: null,
    refreshInterval: null,
  });

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current.map) {
      return;
    }

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([latitude, longitude], 10);

    // Add base layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add cloud/weather layer from OpenWeatherMap
    const cloudLayer = L.tileLayer(
      'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=bd939aa3d82408ba29c8f514db2b425e',
      {
        attribution: '© OpenWeatherMap',
        maxZoom: 18,
        tms: false,
      }
    ).addTo(map);

    // Add location marker
    const marker = L.circleMarker([latitude, longitude], {
      radius: 8,
      fillColor: '#3b82f6',
      color: '#1e40af',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    })
      .addTo(map)
      .bindPopup('Current Location', { closeButton: true });

    // Add fullscreen control
    const fullscreenControl = L.Control.extend({
      options: {
        position: 'topright',
      },
      onAdd: () => {
        const div = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
        const link = L.DomUtil.create('a', '', div);
        link.href = '#';
        link.title = 'Toggle Fullscreen';
        link.textContent = '⛶';
        link.style.fontSize = '18px';
        link.style.width = '30px';
        link.style.height = '30px';
        link.style.lineHeight = '30px';
        link.style.textAlign = 'center';
        link.style.cursor = 'pointer';

        L.DomEvent.on(link, 'click', (e) => {
          L.DomEvent.preventDefault(e);
          if (mapContainerRef.current) {
            if (mapContainerRef.current.requestFullscreen) {
              mapContainerRef.current.requestFullscreen();
            } else if ((mapContainerRef.current as any).webkitRequestFullscreen) {
              (mapContainerRef.current as any).webkitRequestFullscreen();
            } else if ((mapContainerRef.current as any).mozRequestFullScreen) {
              (mapContainerRef.current as any).mozRequestFullScreen();
            } else if ((mapContainerRef.current as any).msRequestFullscreen) {
              (mapContainerRef.current as any).msRequestFullscreen();
            }
          }
        });

        return div;
      },
    });

    new fullscreenControl().addTo(map);

    // Add alert popups if available
    const alertPopups = L.layerGroup().addTo(map);
    if (weather?.alerts && weather.alerts.length > 0) {
      weather.alerts.forEach((alert, idx) => {
        const popupContent = `
          <div style="max-width: 200px;">
            <p style="font-weight: bold; margin: 0 0 5px 0;">${alert.type}</p>
            <p style="margin: 0 0 5px 0; font-size: 12px;">${alert.description}</p>
            <p style="margin: 0; font-size: 11px; color: #666;">
              ${new Date(alert.startTime).toLocaleString()} - ${new Date(alert.endTime).toLocaleString()}
            </p>
          </div>
        `;
        const popup = L.popup({ closeButton: true }).setContent(popupContent);
        L.circleMarker([latitude + idx * 0.05, longitude], {
          radius: 6,
          fillColor: '#ef4444',
          color: '#991b1b',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.6,
        })
          .addTo(alertPopups)
          .bindPopup(popup);
      });
    }

    mapInstanceRef.current = {
      map,
      cloudLayer,
      locationMarker: marker,
      alertPopups,
      refreshInterval: null,
    };

    // Set up cloud layer refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      if (mapInstanceRef.current.map && mapInstanceRef.current.cloudLayer) {
        mapInstanceRef.current.cloudLayer.setUrl(
          'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=bd939aa3d82408ba29c8f514db2b425e'
        );
      }
    }, 5 * 60 * 1000); // 5 minutes

    mapInstanceRef.current.refreshInterval = refreshInterval;

    // Handle resize
    const handleResize = () => {
      if (mapInstanceRef.current.map) {
        mapInstanceRef.current.map.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current.refreshInterval) {
        clearInterval(mapInstanceRef.current.refreshInterval);
      }
      if (mapInstanceRef.current.map) {
        mapInstanceRef.current.map.remove();
        mapInstanceRef.current.map = null;
      }
    };
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96 bg-gray-200 animate-pulse flex items-center justify-center">
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        ref={mapContainerRef}
        className="w-full h-96 rounded-lg"
        style={{ minHeight: '24rem' }}
      />
    </div>
  );
}
