'use client';

import { useState } from 'react';
import { Button, Tabs, Text, View } from 'reshaped';
import type { CourseDetails } from '../hooks/useCourseDetails';
import { MOCK_COORDINATOR, MOCK_TEACHERS } from '../mock';
import styles from './styles.module.scss';

export type CourseCoordinationProps = {
  course: CourseDetails;
};

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
            <Text variant="body-2" color="neutral-faded">
              Conteúdo do Projeto Pedagógico será exibido aqui.
            </Text>
          </View>
        )}

        {activeTab === 'coordinator' && (
          <View className={styles.coordinatorContent}>
            <View className={styles.coordinatorCard}>
              <div className={styles.coordinatorPhoto}>
                {/* TODO: Replace with actual image */}
              </div>
              <View className={styles.coordinatorInfo}>
                <Text
                  as="h3"
                  variant="body-2"
                  weight="bold"
                  className={styles.coordinatorName}
                >
                  {MOCK_COORDINATOR.name}
                </Text>
                <Text
                  variant="body-3"
                  color="neutral-faded"
                  className={styles.coordinatorDescription}
                >
                  {MOCK_COORDINATOR.description}
                </Text>
                <Button variant="outline" size="small">
                  Ver mais
                </Button>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'teachers' && (
          <View className={styles.teachersContent}>
            <Text
              as="h3"
              variant="featured-2"
              weight="bold"
              className={styles.teachersTitle}
            >
              Corpo docente
            </Text>
            <View className={styles.teachersGrid}>
              {MOCK_TEACHERS.map((teacher, index) => (
                <View key={index} className={styles.teacherCard}>
                  <Text
                    as="h4"
                    variant="body-3"
                    weight="bold"
                    className={styles.teacherName}
                  >
                    {teacher.name}
                  </Text>
                  <Text
                    variant="caption-1"
                    color="neutral-faded"
                    className={styles.teacherRole}
                  >
                    {teacher.role}
                  </Text>
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
