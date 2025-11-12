'use client';

import { useState } from 'react';
import {
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
import styles from './styles.module.scss';
import type { FiltersContentProps } from './types';

export function FiltersContent({
  hasActiveFilters = false,
}: FiltersContentProps) {
  const [radius, setRadius] = useState(60);
  const [priceRange, setPriceRange] = useState({ min: 800, max: 2000 });

  const formatPrice = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR')}`;
  };

  return (
    <View className={styles.filtersContent}>
      {hasActiveFilters && <Divider />}

      {/* Course Level Tabs */}
      <Tabs variant="pills-elevated" defaultValue="graduation">
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

      {/* City Input */}
      <FormControl>
        <FormControl.Label>Em que cidade quer estudar?</FormControl.Label>
        <TextField
          name="city"
          placeholder="São José dos Campos"
          defaultValue="São José dos Campos"
        />
      </FormControl>

      {/* Search Radius Slider */}
      <FormControl>
        <View gap={2}>
          <FormControl.Label>Alcance da busca</FormControl.Label>
          <View direction="row" gap={3}>
            <View.Item grow>
              <Slider
                name="radius"
                min={0}
                max={60}
                step={5}
                value={radius}
                onChange={({ value }) => setRadius(value)}
                renderValue={(args) => `${args.value}km`}
              />
            </View.Item>
            <Text variant="body-2" color="neutral">
              {radius}km
            </Text>
          </View>
        </View>
      </FormControl>

      {/* Course Name Input */}
      <FormControl>
        <FormControl.Label>Qual curso quer estudar?</FormControl.Label>
        <TextField name="course" placeholder="Encontre seu curso" />
      </FormControl>

      {/* Course Modality Checkboxes */}
      <FormControl>
        <FormControl.Label>Modalidade do curso</FormControl.Label>
        <View gap={2}>
          <Checkbox name="modality-presencial">Presencial (32)</Checkbox>
          <Checkbox name="modality-semipresencial">
            Semipresencial (50)
          </Checkbox>
          <Checkbox name="modality-ead">A distância EAD (68)</Checkbox>
        </View>
      </FormControl>

      {/* Monthly Price Range Slider */}
      <FormControl>
        <View gap={2}>
          <FormControl.Label>Preço da mensalidade</FormControl.Label>
          <Slider
            name="price"
            range
            min={800}
            max={2000}
            step={50}
            minValue={priceRange.min}
            maxValue={priceRange.max}
            onChange={({ minValue, maxValue }) => {
              if (minValue !== undefined && maxValue !== undefined) {
                setPriceRange({ min: minValue, max: maxValue });
              }
            }}
            renderValue={(args) => {
              if (args.value !== undefined && args.value !== undefined) {
                return `${formatPrice(args.value)} a ${formatPrice(args.value)}`;
              }
              return formatPrice(args.value);
            }}
          />
          <View
            direction="row"
            justify="space-between"
            className={styles.priceRangeLabels}
          >
            <Text variant="body-2" color="neutral">
              {formatPrice(priceRange.min)}
            </Text>
            <Text variant="body-2" color="neutral">
              {formatPrice(priceRange.max)}
            </Text>
          </View>
        </View>
      </FormControl>

      {/* Shift Checkboxes */}
      <FormControl>
        <FormControl.Label>Turno</FormControl.Label>
        <View direction="row" gap={2}>
          <Checkbox name="shift-morning" defaultChecked>
            Manhã (10)
          </Checkbox>
          <Checkbox name="shift-afternoon">Tarde</Checkbox>
          <Checkbox name="shift-night" defaultChecked>
            Noite (22)
          </Checkbox>
          <Checkbox name="shift-fulltime">Integral</Checkbox>
          <Checkbox name="shift-virtual" defaultChecked>
            Virtual (118)
          </Checkbox>
        </View>
      </FormControl>

      {/* Course Duration Checkboxes */}
      <FormControl>
        <FormControl.Label>Duração do curso</FormControl.Label>
        <View direction="row" gap={2}>
          <Checkbox name="duration-1-2">1 a 2 anos</Checkbox>
          <Checkbox name="duration-2-3">2 a 3 anos (78)</Checkbox>
          <Checkbox name="duration-3-4">3 a 4 anos (48)</Checkbox>
          <Checkbox name="duration-4-plus">Mais que 4 anos (4)</Checkbox>
        </View>
      </FormControl>
    </View>
  );
}
