import { getMediaUrl } from '@grupo-ser/utils';
import { useMemo, useState } from 'react';
import { useGeolocation } from '../../../hooks/useGeolocation';
import { useQueryInfrastructure } from './api/query';
import type { StrapiUnitsResponse } from './api/types';
import type { InfrastructureImage, InfrastructureUnit } from './types';
import { markClosestUnit } from './utils';

function transformStrapiResponse(response: StrapiUnitsResponse) {
  const { data } = response;

  const units: InfrastructureUnit[] = data.map((unit) => ({
    id: unit.id.toString(),
    name: unit.name,
    coordinates: {
      lat: unit.latitude,
      lng: unit.longitude,
    },
    imageIds: unit.photos?.map((photo) => photo.id.toString()) || [],
  }));

  const images: InfrastructureImage[] = data.flatMap((unit) =>
    (unit.photos || []).map((photo) => ({
      id: photo.id.toString(),
      src: getMediaUrl(photo.url),
      alt: photo.alternativeText || photo.caption || `${unit.name} - Foto`,
    })),
  );

  const location = data[0]?.institution?.name || '';

  return { units, images, location };
}

export const useInfrastructure = () => {
  const {
    data: response = {
      data: [],
      meta: { pagination: { page: 1, pageSize: 10, pageCount: 1, total: 0 } },
    },
  } = useQueryInfrastructure();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const {
    city,
    state,
    coordinates,
    permissionDenied,
    requestPermission,
    isLoading,
  } = useGeolocation();

  const { units, images, location } = transformStrapiResponse(response);

  const hasData = units.length > 0 && images.length > 0;

  const sortedUnits = useMemo(
    () => markClosestUnit(units, coordinates),
    [units, coordinates],
  );

  const activeUnit = useMemo(() => {
    if (selectedUnitId) {
      return sortedUnits.find((unit) => unit.id === selectedUnitId);
    }
    return sortedUnits.find((unit) => unit.isActive);
  }, [sortedUnits, selectedUnitId]);

  const unitImages = useMemo(() => {
    if (!activeUnit?.imageIds || activeUnit.imageIds.length === 0) {
      return images;
    }
    return images.filter((img) => activeUnit.imageIds?.includes(img.id));
  }, [activeUnit, images]);

  const selectedImage = images.find((img) => img.id === selectedImageId);

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  const handleCloseModal = () => {
    setSelectedImageId(null);
  };

  const handleUnitClick = (unitId: string) => {
    setSelectedUnitId(unitId);
  };

  const mainImage = unitImages[0] || images[0];
  const sideImages = unitImages.slice(1, 5);

  return {
    city,
    state,
    location,
    permissionDenied,
    requestPermission,
    isLoading,
    hasData,
    selectedImage,
    selectedUnitId,
    handleImageClick,
    handleCloseModal,
    handleUnitClick,
    mainImage,
    sideImages,
    sortedUnits,
    activeUnit,
    unitImages,
    selectedImageId,
  };
};
