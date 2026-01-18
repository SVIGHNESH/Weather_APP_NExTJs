'use client';

import React, { useState, useEffect } from 'react';

export interface FavoriteLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
  lastAccessedAt: number;
}

const FAVORITES_STORAGE_KEY = 'favorite_locations';

export function useFavoriteLocations() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isInitialized]);

  const addLocation = (name: string, latitude: number, longitude: number) => {
    const id = `${latitude}-${longitude}-${Date.now()}`;
    const newLocation: FavoriteLocation = {
      id,
      name,
      latitude,
      longitude,
      isFavorite: true,
      lastAccessedAt: Date.now(),
    };
    setFavorites([...favorites, newLocation]);
    return newLocation;
  };

  const removeLocation = (id: string) => {
    setFavorites(favorites.filter(loc => loc.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(favorites.map(loc =>
      loc.id === id ? { ...loc, isFavorite: !loc.isFavorite } : loc
    ));
  };

  const updateLastAccessed = (id: string) => {
    setFavorites(favorites.map(loc =>
      loc.id === id ? { ...loc, lastAccessedAt: Date.now() } : loc
    ));
  };

  // Get favorites sorted by last accessed (most recent first)
  const getSortedFavorites = () => {
    return [...favorites].sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
  };

  return {
    favorites,
    addLocation,
    removeLocation,
    toggleFavorite,
    updateLastAccessed,
    getSortedFavorites,
  };
}
