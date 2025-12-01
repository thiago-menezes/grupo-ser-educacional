import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { CityAutocomplete } from '@/components';
import type { CourseFiltersFormValues } from '../../types';

export type CityInputProps = {
  control: Control<CourseFiltersFormValues>;
};

export function CityInput({ control }: CityInputProps) {
  // Watch the city field value
  const cityValue = useWatch({ control, name: 'city' });

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
