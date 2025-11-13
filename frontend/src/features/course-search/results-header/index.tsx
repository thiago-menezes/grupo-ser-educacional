'use client';

import { Select, Text, View } from 'reshaped';
import styles from './styles.module.scss';

export type ResultsHeaderProps = {
  totalResults?: number;
};

export function ResultsHeader({ totalResults = 150 }: ResultsHeaderProps) {
  return (
    <View className={styles.resultsHeader}>
      <Text variant="body-2" color="neutral">
        {totalResults} cursos encontrados
      </Text>
      <View className={styles.sortContainer}>
        <Text variant="body-2" color="neutral">
          Ordenar por
        </Text>
        <Select
          name="sort"
          options={[{ value: 'relevance', label: 'Mais relevantes' }]}
          size="small"
        />
      </View>
    </View>
  );
}
