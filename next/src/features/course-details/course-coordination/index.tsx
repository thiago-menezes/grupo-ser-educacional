import Image from 'next/image';
import { useState } from 'react';
import { Button, Tabs, Text, View } from 'reshaped';
import { MOCK_COORDINATOR, MOCK_TEACHERS } from '../mock';
import type { CourseDetails } from '../types';
import styles from './styles.module.scss';

export type CourseCoordinationProps = {
  course: CourseDetails;
};

export function CourseCoordination({ course }: CourseCoordinationProps) {
  const [activeTab, setActiveTab] = useState<'coordination' | 'pedagogical'>(
    'coordination',
  );

  return (
    <View className={styles.coordination}>
      <Tabs
        value={activeTab}
        onChange={(args) =>
          setActiveTab(args.value as 'coordination' | 'pedagogical')
        }
      >
        <Tabs.Item value="coordination">Coordenação e Docentes</Tabs.Item>
        <Tabs.Item value="pedagogical">Projeto pedagógico</Tabs.Item>
      </Tabs>

      <View className={styles.tabContent}>
        {activeTab === 'coordination' && (
          <View className={styles.coordinatorContent}>
            <View className={styles.coordinatorCard}>
              <Image
                src={MOCK_COORDINATOR.photo}
                alt={`Foto do coordenador(a) ${MOCK_COORDINATOR.name}`}
                className={styles.coordinatorPhoto}
                width={120}
                height={120}
              />
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
                  Contate a coordenação
                </Button>
              </View>
            </View>

            <View className={styles.teachersContent}>
              <Text
                as="h3"
                variant="featured-2"
                weight="bold"
                className={styles.teachersTitle}
              >
                Corpo docente
              </Text>
              <View className={styles.teachersList}>
                {MOCK_TEACHERS.map((teacher, index) => (
                  <View key={index} className={styles.teacherRow}>
                    <Text
                      as="h4"
                      variant="body-3"
                      weight="bold"
                      className={styles.teacherName}
                    >
                      {teacher.name}
                    </Text>
                    <Text
                      variant="body-3"
                      color="neutral-faded"
                      className={styles.teacherRole}
                    >
                      {teacher.role}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === 'pedagogical' && (
          <View className={styles.pedagogicalContent}>
            <Image
              src="/default-image.png"
              alt={`Capa do curso ${course.name}`}
              className={styles.pedagogicalCover}
              width={200}
              height={120}
            />
            <Text variant="body-2" color="neutral-faded">
              Projeto pedagógico disponível em breve.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
