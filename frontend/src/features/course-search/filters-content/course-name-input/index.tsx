'use client';

import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { FormControl, TextField } from 'reshaped';
import type { CourseFiltersFormValues } from '../../types';

export type CourseNameInputProps = {
  control: Control<CourseFiltersFormValues>;
};

export function CourseNameInput({ control }: CourseNameInputProps) {
  return (
    <Controller
      name="courseName"
      control={control}
      render={({ field }) => (
        <FormControl>
          <FormControl.Label>Qual curso quer estudar?</FormControl.Label>
          <TextField
            name={field.name}
            placeholder="Encontre seu curso"
            value={field.value}
            onChange={({ value }) => field.onChange(value)}
          />
        </FormControl>
      )}
    />
  );
}
