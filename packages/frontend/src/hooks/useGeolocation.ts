'use client';

import { useEffect, useState } from 'react';

type GeolocationState = {
  city: string | null;
  state: string | null;
  coordinates: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: GeolocationPositionError | null;
  permissionDenied: boolean;
  requestPermission: () => void;
};

const DEFAULT_CITY = 'São José dos Campos';
const DEFAULT_STATE = 'SP';

export function useGeolocation(): GeolocationState {
  const [city, setCity] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const reverseGeocode = async (
    latitude: number,
    longitude: number,
  ): Promise<{ city: string; state: string }> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`,
      );
      const data = await response.json();
      return {
        city: data.city || data.locality || DEFAULT_CITY,
        state: data.principalSubdivisionCode?.split('-')[1] || DEFAULT_STATE,
      };
    } catch {
      return { city: DEFAULT_CITY, state: DEFAULT_STATE };
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError(null);
      setPermissionDenied(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { city: geocodedCity, state: geocodedState } =
            await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude,
            );
          setCity(geocodedCity);
          setState(geocodedState);
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setPermissionDenied(false);
          setIsLoading(false);
        } catch {
          setCity(DEFAULT_CITY);
          setState(DEFAULT_STATE);
          setCoordinates(null);
          setIsLoading(false);
        }
      },
      (err) => {
        setError(err);
        setPermissionDenied(
          err.code === GeolocationPositionError.PERMISSION_DENIED,
        );
        setIsLoading(false);
      },
    );
  };

  useEffect(() => {
    // Try to get location on mount - browser will show permission popup
    if (navigator.geolocation) {
      getLocation();
    } else {
      setPermissionDenied(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    city: city || DEFAULT_CITY,
    state: state || DEFAULT_STATE,
    coordinates,
    isLoading,
    error,
    permissionDenied,
    requestPermission: getLocation,
  };
}
