import { useState, useEffect } from 'react';

export interface Location {
  latitude: number;
  longitude: number;
  permissionGranted: boolean;
  error: string | null;
  isLoading: boolean;
}

const DEFAULT_LATITUDE = 40.7128;
const DEFAULT_LONGITUDE = -74.006;
const GEOLOCATION_PERMISSION_KEY = 'geolocation_permission_requested';
const GEOLOCATION_DENIED_KEY = 'geolocation_denied';

export function useGeolocation() {
  const [location, setLocation] = useState<Location>({
    latitude: DEFAULT_LATITUDE,
    longitude: DEFAULT_LONGITUDE,
    permissionGranted: false,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    // Check if we've already denied permission in the past
    const wasDenied = localStorage.getItem(GEOLOCATION_DENIED_KEY);
    const wasRequested = localStorage.getItem(GEOLOCATION_PERMISSION_KEY);

    if (wasDenied === 'true') {
      // User previously denied; don't request again, just use default
      setLocation(prev => ({
        ...prev,
        isLoading: false,
        error: 'Location access denied. Using default location (NYC).',
      }));
      return;
    }

    if (!wasRequested) {
      // First time; request geolocation
      if (!navigator.geolocation) {
        setLocation(prev => ({
          ...prev,
          isLoading: false,
          error: 'Geolocation is not supported by your browser.',
        }));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem(GEOLOCATION_PERMISSION_KEY, 'true');
          localStorage.setItem(GEOLOCATION_DENIED_KEY, 'false');
          setLocation({
            latitude,
            longitude,
            permissionGranted: true,
            error: null,
            isLoading: false,
          });
        },
        (error) => {
          localStorage.setItem(GEOLOCATION_PERMISSION_KEY, 'true');

          if (error.code === error.PERMISSION_DENIED) {
            localStorage.setItem(GEOLOCATION_DENIED_KEY, 'true');
            setLocation(prev => ({
              ...prev,
              isLoading: false,
              error: 'Location permission denied. Using default location (NYC).',
            }));
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setLocation(prev => ({
              ...prev,
              isLoading: false,
              error: 'Location information is unavailable. Using default location (NYC).',
            }));
          } else if (error.code === error.TIMEOUT) {
            setLocation(prev => ({
              ...prev,
              isLoading: false,
              error: 'Location request timed out. Using default location (NYC).',
            }));
          } else {
            setLocation(prev => ({
              ...prev,
              isLoading: false,
              error: 'An unknown error occurred. Using default location (NYC).',
            }));
          }
        }
      );
    } else {
      // Already requested; don't request again
      setLocation(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  // Function to reset permission and request again
  const requestPermissionAgain = () => {
    localStorage.removeItem(GEOLOCATION_DENIED_KEY);
    localStorage.removeItem(GEOLOCATION_PERMISSION_KEY);
    
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setLocation(prev => ({
      ...prev,
      isLoading: true,
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.setItem(GEOLOCATION_PERMISSION_KEY, 'true');
        localStorage.setItem(GEOLOCATION_DENIED_KEY, 'false');
        setLocation({
          latitude,
          longitude,
          permissionGranted: true,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        localStorage.setItem(GEOLOCATION_PERMISSION_KEY, 'true');

        if (error.code === error.PERMISSION_DENIED) {
          localStorage.setItem(GEOLOCATION_DENIED_KEY, 'true');
          setLocation(prev => ({
            ...prev,
            isLoading: false,
            error: 'Location permission denied.',
          }));
        } else {
          setLocation(prev => ({
            ...prev,
            isLoading: false,
            error: 'Failed to get location.',
          }));
        }
      }
    );
  };

  return {
    ...location,
    requestPermissionAgain,
  };
}
