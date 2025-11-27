import { getMediaUrl } from '@grupo-ser/utils';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCityContext } from '@/contexts/city';
import { useGeolocation } from '@/hooks';
import { useQueryInfrastructure } from './api/query';
import type { StrapiUnitsResponse } from './api/types';
import type { InfrastructureImage, InfrastructureUnit } from './types';
import { markClosestUnit } from './utils';
import { createFallbackInfrastructure } from './utils/fallback';

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

function transformStrapiResponseWithFallback(
  response: StrapiUnitsResponse | undefined,
  institutionSlug: string | undefined,
) {
  try {
    const transformed = transformStrapiResponse(response);

    // If units exist but have no images, use fallback
    if (transformed.units.length > 0 && transformed.images.length === 0) {
      if (institutionSlug) {
        const fallback = createFallbackInfrastructure(institutionSlug);
        // Merge: use Strapi units but fallback images
        return {
          units: transformed.units,
          images: fallback.images,
          location: transformed.location || fallback.location,
        };
      }
    }

    return transformed;
  } catch {
    // If transformation fails, use fallback if we have institution slug
    if (institutionSlug) {
      return createFallbackInfrastructure(institutionSlug);
    }
    throw new Error('No data available and no fallback possible');
  }
}

export const useInfrastructure = () => {
  const params = useParams<{ institution?: string }>();
  const institutionSlug = params.institution;

  const {
    data: response,
    error,
    isError,
    isLoading: isQueryLoading,
  } = useQueryInfrastructure();

  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const { city: contextCity, state: contextState } = useCityContext();
  const {
    coordinates,
    permissionDenied,
    requestPermission,
    isLoading: isGeoLoading,
  } = useGeolocation({
    manualCity: contextCity || null,
    manualState: contextState || null,
  });

  // Use context city/state if available
  const city = contextCity || '';
  const state = contextState || '';

  // Transform with fallback support
  const { units, images, location } = useMemo(() => {
    // If there's an error or no response, try fallback
    if (isError || !response) {
      if (institutionSlug) {
        return createFallbackInfrastructure(institutionSlug);
      }
      return { units: [], images: [], location: '' };
    }

    try {
      return transformStrapiResponseWithFallback(response, institutionSlug);
    } catch {
      // If transformation fails, try fallback
      if (institutionSlug) {
        return createFallbackInfrastructure(institutionSlug);
      }
      return { units: [], images: [], location: '' };
    }
  }, [isError, response, institutionSlug]);

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
