import { Button, DropdownMenu, Skeleton, Text, View } from 'reshaped';
import { useSelectedUnit } from './hooks';
import styles from './styles.module.scss';

export function CourseLocationSelector() {
  const { selectedUnit, units, isLoading, handleUnitChange } =
    useSelectedUnit();

  if (isLoading) {
    return (
      <View className={styles.card}>
        <Skeleton width="60%" height={6} />
        <View className={styles.unitCard}>
          <Skeleton width="80%" height={5} />
          <Skeleton width="50%" height={4} />
        </View>
      </View>
    );
  }

  if (!selectedUnit) {
    return null;
  }

  const hasMultipleUnits = units.length > 1;

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
      {hasMultipleUnits && (
        <DropdownMenu>
          <DropdownMenu.Trigger>
            {(attributes) => (
              <Button
                attributes={attributes}
                variant="ghost"
                color="primary"
                size="small"
                className={styles.changeButton}
              >
                Trocar unidade
              </Button>
            )}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {units.map((unit) => (
              <DropdownMenu.Item
                key={unit.id}
                onClick={() => handleUnitChange(unit.id)}
                selected={unit.id === selectedUnit.id}
              >
                <View direction="column" gap={0}>
                  <Text variant="body-2" weight="medium">
                    {unit.name}
                  </Text>
                  <Text variant="caption-1" color="neutral-faded">
                    {unit.city} - {unit.state}
                  </Text>
                </View>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      )}
    </View>
  );
}
