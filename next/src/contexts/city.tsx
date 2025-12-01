'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

type CityContextValue = {
  city: string;
  state: string;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setCityState: (city: string, state: string) => void;
  focusCityField: () => void;
  setFocusCityFieldCallback: (callback: () => void) => void;
};

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityValue] = useState('');
  const [state, setStateValue] = useState('');
  const [focusCallback, setFocusCallback] = useState<(() => void) | null>(null);

  const setCity = useCallback((newCity: string) => {
    setCityValue(newCity);
  }, []);

  const setState = useCallback((newState: string) => {
    setStateValue(newState);
  }, []);

  const setCityState = useCallback((newCity: string, newState: string) => {
    setCityValue(newCity);
    setStateValue(newState);
  }, []);

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
