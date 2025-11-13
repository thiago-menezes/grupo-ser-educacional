'use client';

import { Badge, Button, Divider, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { useCourseFiltersContext } from '../../context';
import styles from './styles.module.scss';

export function ActiveFiltersSidebar() {
  const {
    activeFilters,
    activeFiltersCount,
    handleRemoveFilter,
    handleClearAllFilters,
  } = useCourseFiltersContext();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
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
  );
}
