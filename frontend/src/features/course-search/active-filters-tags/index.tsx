'use client';

import { Badge, Button, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { useCourseFiltersContext } from '../context';
import styles from './styles.module.scss';

export type ActiveFiltersTagsProps = {
  variant?: 'mobile' | 'desktop';
};

export function ActiveFiltersTags({
  variant = 'mobile',
}: ActiveFiltersTagsProps) {
  const { activeFilters, handleRemoveFilter, handleClearAllFilters } =
    useCourseFiltersContext();

  if (activeFilters.length === 0) {
    return null;
  }

  if (variant === 'mobile') {
    return (
      <View className={styles.activeFiltersSection}>
        <View className={styles.activeFilters}>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="outline"
              color="primary"
              onDismiss={() => handleRemoveFilter(filter.id)}
              dismissAriaLabel={`Remover filtro ${filter.label}`}
            >
              {filter.label}
            </Badge>
          ))}
        </View>

        <div>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              handleClearAllFilters();
            }}
            endIcon={<Icon name="trash" size={14} />}
          >
            Limpar todos
          </Button>
        </div>
      </View>
    );
  }

  // Desktop variant is handled inside FiltersContent component
  return null;
}
