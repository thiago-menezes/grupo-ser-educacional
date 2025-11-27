import { Tabs, Text, View } from 'reshaped';
import type { CourseDetails } from '../hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseModalitySelectorProps = {
  modalities: CourseDetails['modalities'];
  selectedModalityId: number | null;
  onSelectModality: (modalityId: number) => void;
};

const MODALITY_LABELS: Record<string, string> = {
  presencial: 'Presencial',
  ead: 'Digital (EAD)',
  'ao-vivo': 'Ao vivo',
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
    <View>
      <Text variant="title-4" className={styles.label}>
        Selecione a modalidade
      </Text>

      <View direction="row" gap={4}>
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
    </View>
  );
}
