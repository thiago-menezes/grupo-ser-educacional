import { useState, useRef, useEffect, useMemo, startTransition } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { FormControl, Autocomplete } from 'reshaped';
import type { AutocompleteProps } from 'reshaped';
import { useCitiesAutocomplete, type CityOption } from '@/hooks';
import type { CourseFiltersFormValues } from '../../types';

export type CityInputProps = {
  control: Control<CourseFiltersFormValues>;
};

function formatCityDisplayValue(
  value: string,
  searchResults: CityOption[],
): string {
  if (!value) return '';

  // Check if value is in technical format "city:name-state:code"
  const techFormatMatch = value.match(/^city:(.+?)-state:([a-z]{2})$/i);
  if (techFormatMatch) {
    const citySlug = techFormatMatch[1];
    const stateCode = techFormatMatch[2].toUpperCase();
    const cityName = citySlug.replace(/-/g, ' ');

    // Try to find in search results first
    const matchedCity = searchResults.find(
      (c) => c.value.toLowerCase() === value.toLowerCase(),
    );
    if (matchedCity) {
      return matchedCity.label;
    }

    // If not found, format manually
    const formattedCity = cityName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return `${formattedCity} - ${stateCode}`;
  }

  // Return as-is if not in technical format
  return value;
}

export function CityInput({ control }: CityInputProps) {
  const [inputValue, setInputValue] = useState('');
  const isUserTypingRef = useRef(false);

  // Watch the city field value
  const cityValue = useWatch({ control, name: 'city' });

  // Use dynamic city search
  const { cities: searchResults, isLoading: isSearching } =
    useCitiesAutocomplete(inputValue);

  // Format display value from field value
  const currentDisplayValue = useMemo(
    () => formatCityDisplayValue(cityValue || '', searchResults),
    [cityValue, searchResults],
  );

  // Sync inputValue with currentDisplayValue when field.value changes externally
  useEffect(() => {
    if (!isUserTypingRef.current && currentDisplayValue) {
      startTransition(() => {
        setInputValue(currentDisplayValue);
      });
    }
  }, [currentDisplayValue]);

  return (
    <Controller
      name="city"
      control={control}
      render={({ field }) => {
        const handleInputChange: AutocompleteProps['onChange'] = ({
          value,
        }) => {
          isUserTypingRef.current = true;
          setInputValue(value || '');
          // Clear field value if user is typing something different
          if (value !== currentDisplayValue) {
            field.onChange('');
          }
          // Reset typing flag after delay
          setTimeout(() => {
            isUserTypingRef.current = false;
          }, 100);
        };

        const handleItemSelect: AutocompleteProps['onItemSelect'] = ({
          data,
        }) => {
          if (data) {
            const option = data as CityOption;
            isUserTypingRef.current = false;
            // Set the technical value format
            field.onChange(option.value);
            setInputValue(option.label);
          }
        };

        // Use search results from API
        const allOptions = searchResults;

        return (
          <FormControl>
            <FormControl.Label>Em que cidade quer estudar?</FormControl.Label>
            <Autocomplete
              name={field.name}
              placeholder="Encontre sua cidade"
              value={inputValue}
              onChange={handleInputChange}
              onItemSelect={handleItemSelect}
            >
              {isSearching && inputValue.trim().length >= 2 && (
                <Autocomplete.Item value="" data={null} disabled>
                  Buscando...
                </Autocomplete.Item>
              )}
              {!isSearching &&
                allOptions.length === 0 &&
                inputValue.trim().length >= 2 && (
                  <Autocomplete.Item value="" data={null} disabled>
                    Nenhuma cidade encontrada
                  </Autocomplete.Item>
                )}
              {allOptions.map((option) => (
                <Autocomplete.Item
                  key={option.value}
                  value={option.label}
                  data={option}
                >
                  {option.label}
                </Autocomplete.Item>
              ))}
            </Autocomplete>
          </FormControl>
        );
      }}
    />
  );
}
