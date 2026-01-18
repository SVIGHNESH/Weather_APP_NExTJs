'use client';

import React, { useState, useRef } from 'react';
import { FavoriteLocation } from '@/hooks/useFavoriteLocations';

interface FavoritesPanelProps {
  favorites: FavoriteLocation[];
  onLocationSelect: (location: FavoriteLocation) => void;
  onAddLocation: () => void;
  onRemoveLocation: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function FavoritesPanel({
  favorites,
  onLocationSelect,
  onAddLocation,
  onRemoveLocation,
  onToggleFavorite,
  isOpen,
  onToggle,
}: FavoritesPanelProps) {
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const handleLocationClick = (location: FavoriteLocation) => {
    onLocationSelect(location);
    setContextMenuId(null);
  };

  const handleRightClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenuId(contextMenuId === id ? null : id);
  };

  const handleDeleteClick = (id: string) => {
    onRemoveLocation(id);
    setContextMenuId(null);
  };

  return (
    <>
      {/* Sidebar toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-6 left-6 bg-blue-500 text-white rounded-lg p-2 shadow-lg hover:bg-blue-600 transition-colors z-40"
        title="Toggle favorites"
      >
        {isOpen ? '✕' : '❤️'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Locations</h2>
          <button
            onClick={onAddLocation}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            + Add Location
          </button>
        </div>

        {/* Favorites list */}
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {favorites.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No saved locations yet</p>
              <p className="text-sm mt-2">Use the search to add locations</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {favorites.map((location) => (
                <div
                  key={location.id}
                  className="relative"
                >
                  <button
                    onClick={() => handleLocationClick(location)}
                    onContextMenu={(e) => handleRightClick(e, location.id)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {location.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {location.lastAccessedAt > 0
                            ? `Last accessed: ${new Date(location.lastAccessedAt).toLocaleDateString()}`
                            : 'Never accessed'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(location.id);
                        }}
                        className="text-2xl ml-2 hover:scale-110 transition-transform"
                        title={location.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {location.isFavorite ? '⭐' : '☆'}
                      </button>
                    </div>
                  </button>

                  {/* Context menu for delete */}
                  {contextMenuId === location.id && (
                    <div
                      ref={contextMenuRef}
                      className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 min-w-[120px]"
                    >
                      <button
                        onClick={() => handleDeleteClick(location.id)}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop to close sidebar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onToggle}
        />
      )}
    </>
  );
}
