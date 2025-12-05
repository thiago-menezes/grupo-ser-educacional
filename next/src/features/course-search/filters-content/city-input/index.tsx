import { useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { CityAutocomplete } from '@/components';
import { useCityContext } from '@/contexts/city';
import type { CourseFiltersFormValues } from '../../types';

export type CityInputProps = {
  control: Control<CourseFiltersFormValues>;
};

export function CityInput({ control }: CityInputProps) {
  // Watch the city field value
  const cityValue = useWatch({ control, name: 'city' });
  const { setCityState } = useCityContext();

  // Sync form value to context (and thus localStorage) when city changes
  useEffect(() => {
    if (cityValue) {
      // Parse cityValue format: city:name-state:code
      const match = cityValue.match(/^city:(.+?)-state:([a-z]{2})$/i);
      if (match) {
        const citySlug = match[1];
        const stateCode = match[2].toUpperCase();
        // Convert slug back to city name (replace hyphens with spaces)
        const cityName = citySlug.replace(/-/g, ' ');
        setCityState(cityName, stateCode, 'manual');
      }
    }
  }, [cityValue, setCityState]);

  return (
    <Controller
      name="city"
      control={control}
      render={({ field }) => (
        <CityAutocomplete
          value={cityValue || ''}
          onChange={field.onChange}
          name={field.name}
        />
      )}
    />
  );
}
