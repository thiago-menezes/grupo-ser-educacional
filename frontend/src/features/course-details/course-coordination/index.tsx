'use client';

import { useState } from 'react';
import { Button, Tabs, View } from 'reshaped';
import type { CourseDetails } from '../hooks/useCourseDetails';
import styles from './styles.module.scss';

export type CourseCoordinationProps = {
  course: CourseDetails;
};

const MOCK_COORDINATOR = {
  name: 'Dr. Josué Claudio dos Santos Fagundes',
  description:
    'Josué Claudio dos Santos Fagundes é um profissional dedicado e experiente, coordenador do curso de Ciência de Dados. Sua paixão por dados e análise o impulsiona a inspirar e guiar os futuros cientistas de dados da UNINASSAU.',
  photo: '/default-image.png',
};

const MOCK_TEACHERS = [
  { name: 'Prof. João Silva', role: 'Professor Titular' },
  { name: 'Prof. Maria Santos', role: 'Professora Associada' },
  { name: 'Prof. Pedro Oliveira', role: 'Professor Assistente' },
  { name: 'Prof. Ana Costa', role: 'Professora Adjunta' },
];

export function CourseCoordination({
  course: _course,
}: CourseCoordinationProps) {
  const [activeTab, setActiveTab] = useState('pedagogical');

  return (
    <View className={styles.coordination}>
      <Tabs value={activeTab} onChange={(args) => setActiveTab(args.value)}>
        <Tabs.Item value="pedagogical">Projeto Pedagógico</Tabs.Item>
        <Tabs.Item value="coordinator">Coordenação</Tabs.Item>
        <Tabs.Item value="teachers">Corpo Docente</Tabs.Item>
      </Tabs>

      <View className={styles.tabContent}>
        {activeTab === 'pedagogical' && (
          <View className={styles.pedagogicalContent}>
            <p>Conteúdo do Projeto Pedagógico será exibido aqui.</p>
          </View>
        )}

        {activeTab === 'coordinator' && (
          <View className={styles.coordinatorContent}>
            <View className={styles.coordinatorCard}>
              <div className={styles.coordinatorPhoto}>
                {/* TODO: Replace with actual image */}
              </div>
              <View className={styles.coordinatorInfo}>
                <h3 className={styles.coordinatorName}>
                  {MOCK_COORDINATOR.name}
                </h3>
                <p className={styles.coordinatorDescription}>
                  {MOCK_COORDINATOR.description}
                </p>
                <Button variant="outline" size="small">
                  Ver mais
                </Button>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'teachers' && (
          <View className={styles.teachersContent}>
            <h3 className={styles.teachersTitle}>Corpo docente</h3>
            <View className={styles.teachersGrid}>
              {MOCK_TEACHERS.map((teacher, index) => (
                <View key={index} className={styles.teacherCard}>
                  <h4 className={styles.teacherName}>{teacher.name}</h4>
                  <p className={styles.teacherRole}>{teacher.role}</p>
                </View>
              ))}
            </View>
            <Button
              variant="outline"
              size="small"
              className={styles.moreButton}
            >
              Ver mais
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
