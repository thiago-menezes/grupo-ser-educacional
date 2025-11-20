'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Divider, Tabs, Text, View } from 'reshaped';
import { MOCK_INFRASTRUCTURE_IMAGES } from '../mock';
import styles from './styles.module.scss';

export function CourseInfrastructureSection() {
  const [selectedUnitId, setSelectedUnitId] = useState(
    MOCK_INFRASTRUCTURE_IMAGES[0]?.unitId || null,
  );

  const selectedUnit = MOCK_INFRASTRUCTURE_IMAGES.find(
    (unit) => unit.unitId === selectedUnitId,
  );

  if (!selectedUnit || !selectedUnit.images.length) {
    return null;
  }

  const mainImage = selectedUnit.images[0];
  const sideImages = selectedUnit.images.slice(1, 4);

  return (
    <View className={styles.section}>
      <Divider />
      <Text
        as="h2"
        variant="featured-2"
        weight="medium"
        className={styles.title}
      >
        Conheça nossa infraestrutura
      </Text>

      <Tabs
        value={selectedUnitId?.toString() || ''}
        onChange={(value) => setSelectedUnitId(Number(value))}
      >
        {MOCK_INFRASTRUCTURE_IMAGES.map((unit) => (
          <Tabs.Item key={unit.unitId} value={unit.unitId.toString()}>
            {unit.unitName}
          </Tabs.Item>
        ))}
      </Tabs>

      <View className={styles.gallery}>
        <button
          className={styles.mainImage}
          type="button"
          aria-label={mainImage.alt}
        >
          <Image
            src={mainImage.src}
            alt={mainImage.alt}
            width={604}
            height={424}
            className={styles.image}
          />
        </button>
        {sideImages.length > 0 && (
          <View className={styles.sideImages}>
            {sideImages.map((image) => (
              <button
                key={image.id}
                className={styles.sideImage}
                type="button"
                aria-label={image.alt}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={290}
                  height={200}
                  className={styles.image}
                />
              </button>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
