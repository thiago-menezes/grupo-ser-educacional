'use client';

import { Modal, View } from 'reshaped';
import { Icon } from '@/components/icon';
import type { CourseDetails } from '../hooks/useCourseDetails';
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
  return (
    <Modal active={isOpen} onClose={onClose} size="large">
      <View className={styles.modal}>
        <View className={styles.header}>
          <h2 className={styles.title}>Grade Curricular - {course.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar modal"
          >
            <Icon name="x" size={24} />
          </button>
        </View>
        <View className={styles.content}>
          {/* TODO: Implement curriculum grid content */}
          <p>Conteúdo da grade curricular será exibido aqui.</p>
        </View>
      </View>
    </Modal>
  );
}
