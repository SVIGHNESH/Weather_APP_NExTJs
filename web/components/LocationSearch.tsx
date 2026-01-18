'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocationSearch, LocationSuggestion } from '@/hooks/useLocationSearch';

interface LocationSearchProps {
  onLocationSelect: (location: LocationSuggestion) => void;
  onClose?: () => void;
}

export function LocationSearch({ onLocationSelect, onClose }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const { suggestions, isLoading, error, debouncedSearch, clearSuggestions } = useLocationSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onLocationSelect(suggestion);
    setSearchQuery('');
    clearSuggestions();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) {
    return null;
  }

  const formatLocationName = (suggestion: LocationSuggestion): string => {
    const parts = [suggestion.name];
    if (suggestion.admin1) {
      parts.push(suggestion.admin1);
    }
    if (suggestion.country) {
      parts.push(suggestion.country);
    }
    return parts.join(', ');
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === containerRef.current) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Search Location</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <div className="flex items-center bg-gray-100 rounded-lg p-3">
              <span className="text-gray-500 mr-3">🔍</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search city, zip code, or coordinates (lat,lon)"
                value={searchQuery}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    clearSuggestions();
                  }}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results section */}
        <div className="max-h-96 overflow-y-auto p-4">
          {error && (
            <div className="text-red-500 text-sm mb-4">
              Error: {error}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">
                <div className="animate-spin">⏳</div>
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            </div>
          )}

          {!isLoading && searchQuery && suggestions.length === 0 && !error && (
            <div className="text-center text-gray-500 py-8">
              <p>No locations found for "{searchQuery}"</p>
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <div className="space-y-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={`${suggestion.name}-${suggestion.latitude}-${idx}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                >
                  <p className="font-semibold text-gray-800">
                    {suggestion.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {suggestion.admin1 && `${suggestion.admin1}, `}
                    {suggestion.country}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    📍 {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                  </p>
                </button>
              ))}
            </div>
          )}

          {!searchQuery && (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">Type a city name, zip code, or coordinates to search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
