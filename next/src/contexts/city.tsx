'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import useLocalStorage from 'use-local-storage';

type CitySource = 'default' | 'geolocation' | 'manual';

type CityStorageData = {
  city: string;
  state: string;
  timestamp: number;
  source?: CitySource;
};

type CityContextValue = {
  city: string;
  state: string;
  source: CitySource;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setCityState: (city: string, state: string, source?: CitySource) => void;
  focusCityField: () => void;
  setFocusCityFieldCallback: (callback: () => void) => void;
};

const CityContext = createContext<CityContextValue | undefined>(undefined);

const CITY_STORAGE_KEY = 'grupo-ser:selected-city';
const DEFAULT_CITY_DATA: CityStorageData = {
  city: '',
  state: '',
  timestamp: Date.now(),
  source: 'default',
};

/**
 * Parse city from URL format: city:name-state:code
 * Returns null if invalid format
 */
function parseCityFromUrl(
  urlValue: string,
): { city: string; state: string } | null {
  const match = urlValue.match(/^city:(.+?)-state:([a-z]{2})$/i);
  if (match) {
    const cityName = match[1].replace(/-/g, ' ');
    const stateCode = match[2].toUpperCase();
    return { city: cityName, state: stateCode };
  }
  return null;
}

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityData, setCityData] = useLocalStorage<CityStorageData>(
    CITY_STORAGE_KEY,
    DEFAULT_CITY_DATA,
  );
  const [focusCallback, setFocusCallback] = useState<(() => void) | null>(null);

  // Check URL parameters on mount (priority over localStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const cityFromUrl = urlParams.get('city');

    if (cityFromUrl) {
      const parsed = parseCityFromUrl(cityFromUrl);
      if (parsed) {
        // URL takes priority - update localStorage with manual source
        setCityData({
          city: parsed.city,
          state: parsed.state,
          timestamp: Date.now(),
          source: 'manual',
        });
      }
    }
  }, []); // Run once on mount

  const city = cityData.city;
  const state = cityData.state;
  const source = cityData.source || 'default';

  const setCity = useCallback(
    (newCity: string) => {
      setCityData((prev) => ({
        city: newCity,
        state: prev?.state || '',
        timestamp: Date.now(),
        source: prev?.source || 'default',
      }));
    },
    [setCityData],
  );

  const setState = useCallback(
    (newState: string) => {
      setCityData((prev) => ({
        city: prev?.city || '',
        state: newState,
        timestamp: Date.now(),
        source: prev?.source || 'default',
      }));
    },
    [setCityData],
  );

  const setCityState = useCallback(
    (newCity: string, newState: string, newSource: CitySource = 'manual') => {
      setCityData({
        city: newCity,
        state: newState,
        timestamp: Date.now(),
        source: newSource,
      });
    },
    [setCityData],
  );

  const focusCityField = useCallback(() => {
    focusCallback?.();
  }, [focusCallback]);

  const setFocusCityFieldCallback = useCallback((callback: () => void) => {
    setFocusCallback(() => callback);
  }, []);

  return (
    <CityContext.Provider
      value={{
        city,
        state,
        source,
        setCity,
        setState,
        setCityState,
        focusCityField,
        setFocusCityFieldCallback,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCityContext() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
}
