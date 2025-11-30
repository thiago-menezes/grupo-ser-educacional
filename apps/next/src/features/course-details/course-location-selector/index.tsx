import { useState } from 'react';
import { Button, Text, View } from 'reshaped';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseLocationSelectorProps = {
  course: CourseDetails;
  selectedUnitId?: number;
  onUnitChange?: (unitId: number) => void;
};

export function CourseLocationSelector({
  course,
  selectedUnitId,
  onUnitChange,
}: CourseLocationSelectorProps) {
  const [currentUnitId, setCurrentUnitId] = useState(
    selectedUnitId || course.units[0]?.id || null,
  );

  const selectedUnit =
    course.units.find((u) => u.id === currentUnitId) || course.units[0];

  const handleChangeUnit = () => {
    // Cycle through units or open a modal in the future
    const currentIndex = course.units.findIndex((u) => u.id === currentUnitId);
    const nextIndex = (currentIndex + 1) % course.units.length;
    const nextUnitId = course.units[nextIndex]?.id;
    if (nextUnitId) {
      setCurrentUnitId(nextUnitId);
      onUnitChange?.(nextUnitId);
    }
  };

  if (!selectedUnit) {
    return null;
  }

  return (
    <View className={styles.card}>
      <Text
        as="h3"
        variant="featured-2"
        weight="medium"
        className={styles.title}
      >
        Onde você vai estudar
      </Text>
      <View className={styles.unitCard}>
        <Text variant="body-2" weight="bold" className={styles.unitName}>
          {selectedUnit.name}
        </Text>
        <Text
          variant="body-3"
          color="neutral-faded"
          className={styles.unitLocation}
        >
          {selectedUnit.city} - {selectedUnit.state}
        </Text>
      </View>
      <Button
        variant="ghost"
        color="primary"
        size="small"
        onClick={handleChangeUnit}
        className={styles.changeButton}
      >
        Trocar campos
      </Button>
    </View>
  );
}
