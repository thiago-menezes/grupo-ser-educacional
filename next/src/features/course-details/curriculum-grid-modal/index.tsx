import { Button, Modal, View } from 'reshaped';
import { Icon } from '@/components';
import { CurriculumGrid } from '../curriculum-grid';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CurriculumGridModalProps = {
  isOpen: boolean;
  onClose: () => void;
  course: CourseDetails;
};

export function CurriculumGridModal({
  isOpen,
  onClose,
  course,
}: CurriculumGridModalProps) {
  // Pega a primeira modalidade disponível como padrão
  const defaultModality =
    course.modalities[0]?.slug === 'presencial'
      ? 'presencial'
      : course.modalities[0]?.slug === 'ead'
        ? 'ead'
        : course.modalities[0]?.slug === 'semipresencial'
          ? 'semipresencial'
          : 'presencial';

  return (
    <Modal active={isOpen} onClose={onClose} size="large">
      <View className={styles.modal}>
        <Button
          variant="ghost"
          size="small"
          onClick={onClose}
          icon={<Icon name="x" size={24} />}
          className={styles.closeButton}
          aria-label="Fechar modal"
        />

        <View className={styles.content}>
          <CurriculumGrid
            courseId={course.id.toString()}
            defaultModality={defaultModality}
          />
        </View>
      </View>
    </Modal>
  );
}
