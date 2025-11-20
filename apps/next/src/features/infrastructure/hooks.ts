'use client';

import { getMediaUrl } from '@grupo-ser/utils';
import { useMemo, useState } from 'react';
import { useGeolocation } from '@/hooks';
import { useQueryInfrastructure } from './api/query';
import type { StrapiUnitsResponse } from './api/types';
import type { InfrastructureImage, InfrastructureUnit } from './types';
import { markClosestUnit } from './utils';

function transformStrapiResponse(response?: StrapiUnitsResponse) {
  if (!response) {
    throw new Error('No response from API');
  }

  const { data = [] } = response;

  if (data.length === 0) {
    throw new Error(
      'No units found - check if units are associated with institutions in Strapi admin',
    );
  }

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
    data: response,
    error,
    isError,
    isLoading: isQueryLoading,
  } = useQueryInfrastructure();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const {
    city,
    state,
    coordinates,
    permissionDenied,
    requestPermission,
    isLoading: isGeoLoading,
  } = useGeolocation();

  // Only transform if there's no error and we have data
  const { units, images, location } = useMemo(() => {
    if (isError || !response) {
      return { units: [], images: [], location: '' };
    }
    try {
      return transformStrapiResponse(response);
    } catch {
      // Transform errors are handled by returning empty data
      return { units: [], images: [], location: '' };
    }
  }, [isError, response]);

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
    isLoading: isQueryLoading || isGeoLoading,
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
    error,
    isError,
  };
};
