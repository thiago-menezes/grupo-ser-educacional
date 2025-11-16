import { clsx } from 'clsx';
import Image from 'next/image';
import { Button, Text } from 'reshaped';
import { Icon } from '../../../components';
import { useInfrastructure } from './hooks';
import { ImageModal } from './image-modal';
import styles from './styles.module.scss';

export const InfrastructureSection = () => {
  const {
    city,
    state,
    permissionDenied,
    requestPermission,
    isLoading,
    sortedUnits,
    handleUnitClick,
    mainImage,
    sideImages,
    handleImageClick,
    handleCloseModal,
    selectedImageId,
    selectedUnitId,
    selectedImage,
  } = useInfrastructure();

  if (!mainImage) {
    return null;
  }

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
              Conheça nossa infraestrutura
            </Text>
            <div className={styles.locationInfo}>
              <Text as="span" variant="body-2">
                Unidades próximas a você
              </Text>
              <div className={styles.location}>
                {permissionDenied ? (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={requestPermission}
                    disabled={isLoading}
                    className={styles.locationButton}
                  >
                    <Icon name="current-location" size={16} />
                    Permitir localização
                  </Button>
                ) : (
                  <>
                    <Text
                      as="span"
                      variant="body-2"
                      weight="medium"
                      className={styles.locationText}
                    >
                      {city} - {state}
                    </Text>
                    <Icon
                      name="current-location"
                      size={16}
                      className={styles.locationIcon}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            color="primary"
            aria-label="Ver todas as unidades"
          >
            Ver todas as unidades
          </Button>
        </div>

        <div className={styles.tags}>
          {sortedUnits.map((unit) => {
            const isActive =
              selectedUnitId === unit.id || (!selectedUnitId && unit.isActive);
            return (
              <button
                key={unit.id}
                className={clsx(styles.tag, isActive && styles.tagActive)}
                onClick={() => handleUnitClick(unit.id)}
                type="button"
              >
                {unit.name}
              </button>
            );
          })}
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
