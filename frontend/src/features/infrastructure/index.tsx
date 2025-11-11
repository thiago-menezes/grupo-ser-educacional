'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import { useState } from 'react';
import { Button, Text } from 'reshaped';
import { Icon } from '@/components/icon';
import { DEFAULT_INFRASTRUCTURE_CONTENT } from './constants';
import { ImageModal } from './image-modal';
import styles from './styles.module.scss';
import type { InfrastructureSectionProps } from './types';

export const InfrastructureSection = ({
  content = DEFAULT_INFRASTRUCTURE_CONTENT,
}: InfrastructureSectionProps) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const selectedImage = content.images.find(
    (img) => img.id === selectedImageId,
  );

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  const handleCloseModal = () => {
    setSelectedImageId(null);
  };

  const mainImage = content.images[0];
  const sideImages = content.images.slice(1, 5);

  return (
    <section
      className={styles.section}
      aria-labelledby="infrastructure-section-title"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Text
              as="h2"
              variant="featured-1"
              weight="bold"
              className={styles.title}
            >
              {content.title}
            </Text>
            <div className={styles.locationInfo}>
              <Text as="span" variant="body-2">
                {content.locationLabel}
              </Text>
              <div className={styles.location}>
                <Text
                  as="span"
                  variant="body-2"
                  weight="medium"
                  className={styles.locationText}
                >
                  {content.location} - {content.locationState}
                </Text>
                <Icon
                  name="map-pin"
                  size={16}
                  className={styles.locationIcon}
                />
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            color="primary"
            onClick={() => console.log('Ver todas as unidades')}
            aria-label={content.viewAllButtonLabel}
          >
            {content.viewAllButtonLabel}
          </Button>
        </div>

        <div className={styles.tags}>
          {content.units.map((unit) => (
            <button
              key={unit.id}
              className={clsx(styles.tag, unit.isActive && styles.tagActive)}
              onClick={() => console.log('Unit selected:', unit.id)}
              type="button"
            >
              {unit.name}
            </button>
          ))}
        </div>

        <div className={styles.gallery}>
          <button
            className={styles.mainImage}
            onClick={() => handleImageClick(mainImage.id)}
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
          <div className={styles.sideImages}>
            {sideImages.map((image) => (
              <button
                key={image.id}
                className={styles.sideImage}
                onClick={() => handleImageClick(image.id)}
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
          </div>
        </div>
      </div>

      <ImageModal
        active={selectedImageId !== null}
        image={selectedImage || null}
        onClose={handleCloseModal}
      />
    </section>
  );
};
