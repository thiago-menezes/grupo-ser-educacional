'use client';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Slider,
  Tabs,
  Text,
  TextField,
  View,
} from 'reshaped';
import { Icon } from '@/components/icon';
import { useCourseFiltersContext } from '../context';
import type { CourseFiltersFormValues } from '../types';
import { FILTERS_CONTENT_HEIGHT_TO_UPDATE } from './constants';
import styles from './styles.module.scss';

export function FiltersContent({ isInModal }: { isInModal?: boolean }) {
  const {
    filters,
    activeFilters,
    activeFiltersCount,
    updateFilters,
    handleRemoveFilter,
    handleClearAllFilters,
  } = useCourseFiltersContext();

  const { control, handleSubmit, reset } = useForm<CourseFiltersFormValues>({
    defaultValues: filters,
  });

  const [scrollTop, setScrollTop] = useState(0);

  const formatPrice = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScrollTop(window.scrollY);
      const handleScroll = () => {
        setScrollTop(window.scrollY);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    reset(filters);
  }, [filters, reset]);

  const onSubmit = (data: CourseFiltersFormValues) => {
    updateFilters(data);
  };

  const onCancel = () => {
    reset(filters);
    if (isInModal) {
      // Close modal logic will be handled by parent
    }
  };

  return (
    <View className={styles.filtersContent}>
      <div
        className={clsx(styles.formInputsContainer, {
          [styles.formInputsUpdatedHeight]:
            scrollTop > FILTERS_CONTENT_HEIGHT_TO_UPDATE,
          [styles.viewPortMedium]: isInModal,
        })}
      >
        {activeFilters.length > 0 && (
          <View className={styles.activeFiltersSidebar}>
            <View className={styles.activeFiltersHeader}>
              <Text variant="body-2" color="neutral" weight="medium">
                Filtros aplicados
              </Text>

              <Badge color="critical" size="small" rounded>
                {activeFiltersCount}
              </Badge>
            </View>

            <div>
              <Button
                variant="outline"
                size="small"
                color="neutral"
                icon={<Icon name="trash" size={14} />}
                onClick={handleClearAllFilters}
              >
                Limpar todos
              </Button>
            </div>

            <View gap={2} direction="row" wrap>
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.id}
                  color="primary"
                  variant="outline"
                  onDismiss={() => handleRemoveFilter(filter.id)}
                  dismissAriaLabel={`Remover filtro ${filter.label}`}
                >
                  {filter.label}
                </Badge>
              ))}
            </View>

            <Divider />
          </View>
        )}

        <Controller
          name="courseLevel"
          control={control}
          render={({ field }) => (
            <Tabs
              variant="pills-elevated"
              value={field.value}
              onChange={(value) => field.onChange(value)}
            >
              <Tabs.List>
                <Tabs.Item
                  data-id="graduation"
                  value="graduation"
                  icon={<Icon name="school" />}
                >
                  Graduação
                </Tabs.Item>

                <Tabs.Item
                  data-id="postgraduate"
                  value="postgraduate"
                  icon={<Icon name="briefcase" />}
                >
                  Pós-Graduação
                </Tabs.Item>
              </Tabs.List>
            </Tabs>
          )}
        />

        {/* City Input */}
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControl.Label>Em que cidade quer estudar?</FormControl.Label>
              <TextField
                name={field.name}
                placeholder="São José dos Campos"
                value={field.value}
                onChange={({ value }) => field.onChange(value)}
              />
            </FormControl>
          )}
        />

        {/* Search Radius Slider */}
        <Controller
          name="radius"
          control={control}
          render={({ field }) => (
            <FormControl>
              <View gap={2}>
                <FormControl.Label>Alcance da busca</FormControl.Label>
                <View direction="row" gap={3}>
                  <View.Item grow>
                    <Slider
                      name={field.name}
                      min={0}
                      max={60}
                      step={5}
                      value={field.value}
                      onChange={({ value }) => field.onChange(value)}
                      renderValue={(args) => `${args.value}km`}
                    />
                  </View.Item>
                  <Text variant="body-2" color="neutral">
                    {field.value}km
                  </Text>
                </View>
              </View>
            </FormControl>
          )}
        />

        {/* Course Name Input */}
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

        {/* Course Modality Checkboxes */}
        <Controller
          name="modalities"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControl.Label>Modalidade do curso</FormControl.Label>
              <View gap={2}>
                <Checkbox
                  name="modality-presencial"
                  checked={field.value.includes('presencial')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, 'presencial']);
                    } else {
                      field.onChange(
                        field.value.filter((m) => m !== 'presencial'),
                      );
                    }
                  }}
                >
                  Presencial (32)
                </Checkbox>
                <Checkbox
                  name="modality-semipresencial"
                  checked={field.value.includes('semipresencial')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, 'semipresencial']);
                    } else {
                      field.onChange(
                        field.value.filter((m) => m !== 'semipresencial'),
                      );
                    }
                  }}
                >
                  Semipresencial (50)
                </Checkbox>
                <Checkbox
                  name="modality-ead"
                  checked={field.value.includes('ead')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, 'ead']);
                    } else {
                      field.onChange(field.value.filter((m) => m !== 'ead'));
                    }
                  }}
                >
                  A distância EAD (68)
                </Checkbox>
              </View>
            </FormControl>
          )}
        />

        {/* Monthly Price Range Slider */}
        <Controller
          name="priceRange"
          control={control}
          render={({ field }) => (
            <FormControl>
              <View gap={2}>
                <FormControl.Label>Preço da mensalidade</FormControl.Label>
                <Slider
                  name={field.name}
                  range
                  min={800}
                  max={2000}
                  step={50}
                  minValue={field.value.min}
                  maxValue={field.value.max}
                  onChange={(args) => {
                    if (
                      'minValue' in args &&
                      'maxValue' in args &&
                      args.minValue !== undefined &&
                      args.maxValue !== undefined
                    ) {
                      field.onChange({
                        min: args.minValue,
                        max: args.maxValue,
                      });
                    }
                  }}
                  renderValue={(args) => {
                    if (
                      'minValue' in args &&
                      'maxValue' in args &&
                      typeof args.minValue === 'number' &&
                      typeof args.maxValue === 'number'
                    ) {
                      return `${formatPrice(args.minValue)} a ${formatPrice(args.maxValue)}`;
                    }
                    if (
                      args.value !== undefined &&
                      args.value !== null &&
                      typeof args.value === 'number'
                    ) {
                      return formatPrice(args.value);
                    }
                    return '';
                  }}
                />
                <View
                  direction="row"
                  justify="space-between"
                  className={styles.priceRangeLabels}
                >
                  <Text variant="body-2" color="neutral">
                    {formatPrice(field.value.min)}
                  </Text>
                  <Text variant="body-2" color="neutral">
                    {formatPrice(field.value.max)}
                  </Text>
                </View>
              </View>
            </FormControl>
          )}
        />

        {/* Shift Checkboxes */}
        <Controller
          name="shifts"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControl.Label>Turno</FormControl.Label>
              <View direction="row" gap={2}>
                <Checkbox
                  name="shift-morning"
                  checked={field.value.includes('morning')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, 'morning']);
                    } else {
                      field.onChange(
                        field.value.filter((s) => s !== 'morning'),
                      );
                    }
                  }}
                >
                  Manhã (10)
                </Checkbox>
                <Checkbox
                  name="shift-afternoon"
                  checked={field.value.includes('afternoon')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, 'afternoon']);
                    } else {
                      field.onChange(
                        field.value.filter((s) => s !== 'afternoon'),
                      );
                    }
                  }}
                >
                  Tarde
                </Checkbox>
                <Checkbox
                  name="shift-night"
                  checked={field.value.includes('night')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, 'night']);
                    } else {
                      field.onChange(field.value.filter((s) => s !== 'night'));
                    }
                  }}
                >
                  Noite (22)
                </Checkbox>
                <Checkbox
                  name="shift-fulltime"
                  checked={field.value.includes('fulltime')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, 'fulltime']);
                    } else {
                      field.onChange(
                        field.value.filter((s) => s !== 'fulltime'),
                      );
                    }
                  }}
                >
                  Integral
                </Checkbox>
                <Checkbox
                  name="shift-virtual"
                  checked={field.value.includes('virtual')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, 'virtual']);
                    } else {
                      field.onChange(
                        field.value.filter((s) => s !== 'virtual'),
                      );
                    }
                  }}
                >
                  Virtual (118)
                </Checkbox>
              </View>
            </FormControl>
          )}
        />

        {/* Course Duration Checkboxes */}
        <Controller
          name="durations"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormControl.Label>Duração do curso</FormControl.Label>
              <View direction="row" gap={2}>
                <Checkbox
                  name="duration-1-2"
                  checked={field.value.includes('1-2')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, '1-2']);
                    } else {
                      field.onChange(field.value.filter((d) => d !== '1-2'));
                    }
                  }}
                >
                  1 a 2 anos
                </Checkbox>
                <Checkbox
                  name="duration-2-3"
                  checked={field.value.includes('2-3')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, '2-3']);
                    } else {
                      field.onChange(field.value.filter((d) => d !== '2-3'));
                    }
                  }}
                >
                  2 a 3 anos (78)
                </Checkbox>
                <Checkbox
                  name="duration-3-4"
                  checked={field.value.includes('3-4')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, '3-4']);
                    } else {
                      field.onChange(field.value.filter((d) => d !== '3-4'));
                    }
                  }}
                >
                  3 a 4 anos (48)
                </Checkbox>
                <Checkbox
                  name="duration-4-plus"
                  checked={field.value.includes('4-plus')}
                  onChange={({ checked }) => {
                    if (checked) {
                      field.onChange([...field.value, '4-plus']);
                    } else {
                      field.onChange(field.value.filter((d) => d !== '4-plus'));
                    }
                  }}
                >
                  Mais que 4 anos (4)
                </Checkbox>
              </View>
            </FormControl>
          )}
        />
      </div>

      <Divider />

      <View gap={2} direction="row" justify="end">
        <Button variant="outline" color="neutral" onClick={onCancel}>
          Cancelar
        </Button>

        <Button
          variant="solid"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Aplicar filtros
        </Button>
      </View>
    </View>
  );
}
