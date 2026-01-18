import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

export type TemperatureUnit = 'C' | 'F';
export type SpeedUnit = 'kmh' | 'mph';
export type PressureUnit = 'hpa' | 'inhg' | 'mmhg';
export type Theme = 'light' | 'dark' | 'auto';

export interface Settings {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  pressureUnit: PressureUnit;
  theme: Theme;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  convertTemperature: (celsius: number) => number;
  convertSpeed: (kmh: number) => number;
  convertPressure: (hpa: number) => number;
  formatTemperature: (celsius: number) => string;
  formatSpeed: (kmh: number) => string;
  formatPressure: (hpa: number) => string;
}

const DEFAULT_SETTINGS: Settings = {
  temperatureUnit: 'C',
  speedUnit: 'kmh',
  pressureUnit: 'hpa',
  theme: 'auto',
};

const SETTINGS_STORAGE_KEY = 'weather_settings';

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error('Failed to parse settings from localStorage:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save settings to localStorage and apply theme
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      
      // Apply theme to document
      const html = document.documentElement;
      if (settings.theme === 'auto') {
        html.classList.remove('dark', 'light');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          html.classList.add('dark');
        } else {
          html.classList.add('light');
        }
      } else {
        html.classList.remove('dark', 'light');
        html.classList.add(settings.theme);
      }
    }
  }, [settings, isInitialized]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Conversion functions
  const convertTemperature = (celsius: number): number => {
    if (settings.temperatureUnit === 'F') {
      return (celsius * 9/5) + 32;
    }
    return celsius;
  };

  const convertSpeed = (kmh: number): number => {
    if (settings.speedUnit === 'mph') {
      return kmh * 0.621371;
    }
    return kmh;
  };

  const convertPressure = (hpa: number): number => {
    if (settings.pressureUnit === 'inhg') {
      return hpa * 0.02953;
    }
    if (settings.pressureUnit === 'mmhg') {
      return hpa * 0.75006;
    }
    return hpa;
  };

  // Format functions with units
  const formatTemperature = (celsius: number): string => {
    const converted = convertTemperature(celsius);
    return `${Math.round(converted)}°${settings.temperatureUnit}`;
  };

  const formatSpeed = (kmh: number): string => {
    const converted = convertSpeed(kmh);
    const unit = settings.speedUnit === 'mph' ? 'mph' : 'km/h';
    return `${Math.round(converted)} ${unit}`;
  };

  const formatPressure = (hpa: number): string => {
    const converted = convertPressure(hpa);
    const unitMap = { hpa: 'hPa', inhg: 'inHg', mmhg: 'mmHg' };
    const unit = unitMap[settings.pressureUnit];
    return `${Math.round(converted * 10) / 10} ${unit}`;
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    convertTemperature,
    convertSpeed,
    convertPressure,
    formatTemperature,
    formatSpeed,
    formatPressure,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
