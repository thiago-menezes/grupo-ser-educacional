'use client';

import { Tabs, View } from 'reshaped';
import type { CourseDetails } from '../hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseModalitySelectorProps = {
  modalities: CourseDetails['modalities'];
  selectedModalityId: number | null;
  onSelectModality: (modalityId: number) => void;
};

const MODALITY_LABELS: Record<string, string> = {
  presencial: 'Presencial',
  ead: 'EAD',
  hibrido: 'Híbrido',
  semipresencial: 'Semipresencial',
};

export function CourseModalitySelector({
  modalities,
  selectedModalityId,
  onSelectModality,
}: CourseModalitySelectorProps) {
  if (modalities.length === 0) return null;

  return (
    <View className={styles.selector}>
      <h2 className={styles.label}>Selecione modalidade</h2>
      <Tabs
        value={selectedModalityId?.toString() || ''}
        onChange={(value) => onSelectModality(Number(value))}
      >
        {modalities.map((modality) => (
          <Tabs.Item key={modality.id} value={modality.id.toString()}>
            {MODALITY_LABELS[modality.slug] || modality.name}
          </Tabs.Item>
        ))}
      </Tabs>
    </View>
  );
}
