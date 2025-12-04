import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useCityContext } from '@/contexts/city';
import { useGeolocation } from '@/hooks';
import { getMediaUrl } from '@/packages/utils';
import { useQueryClientUnits } from './api/query-client-units';
import { useQueryUnitById } from './api/query';
import type { InfrastructureImage, InfrastructureUnit } from './types';
import { markClosestUnit } from './utils';

/**
 * Transform client API units to InfrastructureUnit format
 */
function transformClientUnits(
  units: Array<{ id: number; name: string; state: string; city: string }>,
): InfrastructureUnit[] {
  // Note: Client API doesn't provide coordinates
  // Units will appear without coordinates until user selects one
  return units.map((unit) => ({
    id: unit.id.toString(),
    name: unit.name,
    coordinates: {
      lat: 0, // Placeholder - could be enhanced with geocoding service
      lng: 0,
    },
    imageIds: [], // Images loaded separately from Strapi
  }));
}

/**
 * Hook for infrastructure with client API integration
 * Flow:
 * 1. Fetch units list from client API (by city/state)
 * 2. User selects a unit
 * 3. Fetch images for selected unit from Strapi (by unit ID)
 */
export const useInfrastructureCombined = (preselectedUnitId?: number) => {
  const params = useParams<{ institution?: string }>();
  const institutionSlug = params.institution;

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

  const city = contextCity || '';
  const state = contextState || '';

  // Step 1: Fetch units from client API
  const {
    data: clientUnitsResponse,
    error: clientError,
    isError: isClientError,
    isLoading: isClientLoading,
  } = useQueryClientUnits(institutionSlug, state, city, !!city && !!state);

  // State for selected unit
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(
    preselectedUnitId?.toString() || null,
  );
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Sync with preselected unit from parent
  useEffect(() => {
    if (preselectedUnitId !== undefined) {
      setSelectedUnitId(preselectedUnitId.toString());
    }
  }, [preselectedUnitId]);

  // Reset selected unit when city or state changes
  useEffect(() => {
    setSelectedUnitId(null);
    setSelectedImageId(null);
  }, [city, state]);

  // Step 2: Fetch images for selected unit from Strapi
  const selectedUnitIdNum = selectedUnitId
    ? parseInt(selectedUnitId, 10)
    : undefined;
  const {
    data: strapiUnitResponse,
    isLoading: isStrapiLoading,
  } = useQueryUnitById(selectedUnitIdNum, !!selectedUnitIdNum);

  // Transform client units
  const units = useMemo(() => {
    if (!clientUnitsResponse?.data) return [];
    return transformClientUnits(clientUnitsResponse.data);
  }, [clientUnitsResponse]);

  // Extract images from Strapi unit
  const images: InfrastructureImage[] = useMemo(() => {
    if (!strapiUnitResponse?.data?.[0]?.photos) return [];

    const unit = strapiUnitResponse.data[0];
    return unit.photos.map((photo) => ({
      id: photo.id.toString(),
      src: getMediaUrl(photo.url),
      alt: photo.alternativeText || photo.caption || `${unit.name} - Foto`,
    }));
  }, [strapiUnitResponse]);

  const hasData = units.length > 0;
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

  const unitImages = images; // All images belong to selected unit

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

  const mainImage = unitImages[0];
  const sideImages = unitImages.slice(1, 5);

  return {
    city,
    state,
    location: clientUnitsResponse?.meta?.institution || '',
    permissionDenied,
    requestPermission,
    isLoading:
      isClientLoading || isGeoLoading || (!!selectedUnitId && isStrapiLoading),
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
    error: clientError,
    isError: isClientError,
  };
};
