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
        <Select name="sort" size="small">
          <option value="relevance">Mais relevantes</option>
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
          <option value="duration-asc">Menor duração</option>
          <option value="duration-desc">Maior duração</option>
          <option value="degree-asc">Menor grau</option>
          <option value="degree-desc">Maior grau</option>
          <option value="campus-asc">Menos próximo</option>
          <option value="campus-desc">Mais próximo</option>
        </Select>
      </View>
    </View>
  );
}
