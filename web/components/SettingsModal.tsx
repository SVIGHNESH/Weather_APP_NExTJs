'use client';

import React from 'react';
import { useSettings, TemperatureUnit, SpeedUnit, PressureUnit, Theme } from '@/hooks/useSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Settings content */}
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Temperature Unit */}
          <div>
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Temperature Unit
            </p>
            <div className="flex gap-2">
              {(['C', 'F'] as TemperatureUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => updateSettings({ temperatureUnit: unit })}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                    settings.temperatureUnit === unit
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  °{unit}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Unit */}
          <div>
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Speed Unit
            </p>
            <div className="flex gap-2">
              {(['kmh', 'mph'] as SpeedUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => updateSettings({ speedUnit: unit })}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                    settings.speedUnit === unit
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {unit === 'kmh' ? 'km/h' : 'mph'}
                </button>
              ))}
            </div>
          </div>

          {/* Pressure Unit */}
          <div>
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Pressure Unit
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['hpa', 'inhg', 'mmhg'] as PressureUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => updateSettings({ pressureUnit: unit })}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                    settings.pressureUnit === unit
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {unit === 'hpa' ? 'hPa' : unit === 'inhg' ? 'inHg' : 'mmHg'}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'auto'] as Theme[]).map((theme) => (
                <button
                  key={theme}
                  onClick={() => updateSettings({ theme })}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors capitalize ${
                    settings.theme === theme
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {theme === 'auto' ? '🔄 Auto' : theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
              ))}
            </div>
          </div>

          {/* Info text */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <p>Settings are automatically saved and synced across your device.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
