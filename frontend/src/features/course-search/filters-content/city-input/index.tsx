'use client';

import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { FormControl, TextField } from 'reshaped';
import type { CourseFiltersFormValues } from '../../types';

export type CityInputProps = {
  control: Control<CourseFiltersFormValues>;
};

export function CityInput({ control }: CityInputProps) {
  return (
    <Controller
      name="city"
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormControl.Label>Em que cidade quer estudar?</FormControl.Label>
          <TextField
            name={field.name}
            placeholder="Ex: Fortaleza"
            value={field.value}
            onChange={({ value }) => field.onChange(value)}
          />
        </FormControl>
      )}
    />
  );
}
