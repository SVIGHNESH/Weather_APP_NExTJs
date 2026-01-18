'use client';

import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';

interface SettingsPanelProps {
  onEnableLocation?: () => void;
  locationDenied?: boolean;
}

export function SettingsPanel({ onEnableLocation, locationDenied }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      {/* Settings button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-40"
        title="Settings"
      >
        ⚙️
      </button>

      {/* Settings panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl p-6 w-80 z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Options</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Settings options */}
          <div className="space-y-3">
            {/* App Settings */}
            <button
              onClick={() => {
                setShowSettingsModal(true);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <p className="font-semibold text-gray-800">⚙️ App Settings</p>
              <p className="text-xs text-gray-600">Temperature, speed, pressure units & theme</p>
            </button>

            {/* Location Settings */}
            <div className="border-t pt-3">
              <p className="font-semibold text-gray-800 mb-2">📍 Location</p>
              {locationDenied ? (
                <p className="text-sm text-gray-600 mb-3">
                  Location access was previously denied. You can enable it now to see weather for your current location.
                </p>
              ) : (
                <p className="text-sm text-gray-600 mb-3">
                  The app uses your location to show weather for your area.
                </p>
              )}
              <button
                onClick={() => {
                  if (onEnableLocation) {
                    onEnableLocation();
                  }
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                {locationDenied ? 'Enable Location' : 'Update Location'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Backdrop to close settings when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
