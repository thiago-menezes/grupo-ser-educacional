import { institutions, units } from '@/packages/bff/data';
import type { InfrastructureImage, InfrastructureUnit } from '../types';

/**
 * Get institution ID from slug
 */
function getInstitutionIdBySlug(slug: string): number | null {
  const institution = institutions.find((inst) => inst.slug === slug);
  return institution?.id || null;
}

/**
 * Create fallback infrastructure data from static units data
 */
export function createFallbackInfrastructure(institutionSlug: string): {
  units: InfrastructureUnit[];
  images: InfrastructureImage[];
  location: string;
} {
  const institutionId = getInstitutionIdBySlug(institutionSlug);
  const institution = institutions.find(
    (inst) => inst.slug === institutionSlug,
  );

  if (!institutionId) {
    return { units: [], images: [], location: '' };
  }

  // Filter units by institution
  const institutionUnits = units.filter(
    (unit) => unit.institutionId === institutionId && unit.active,
  );

  if (institutionUnits.length === 0) {
    return { units: [], images: [], location: institution?.name || '' };
  }

  // Create fallback units
  const fallbackUnits: InfrastructureUnit[] = institutionUnits.map((unit) => ({
    id: unit.id.toString(),
    name: unit.name,
    coordinates: {
      lat: unit.latitude,
      lng: unit.longitude,
    },
    imageIds: [], // Will be populated with fallback images
  }));

  // Create fallback images for each unit
  // Using gallery images from public folder
  const galleryImages = [
    '/galeria-1.png',
    '/galeria-2.png',
    '/galeria-3.png',
    '/galeria-4.png',
  ];
  const fallbackImages: InfrastructureImage[] = institutionUnits.flatMap(
    (unit) => {
      // Create 4 fallback images per unit
      const imageCount = 4;
      return Array.from({ length: imageCount }, (_, imageIndex) => {
        const imageId = `${unit.id}-fallback-${imageIndex + 1}`;
        return {
          id: imageId,
          src: galleryImages[imageIndex % galleryImages.length],
          alt: `${unit.name} - Infraestrutura ${imageIndex + 1}`,
        };
      });
    },
  );

  // Update unit imageIds to reference the fallback images
  fallbackUnits.forEach((unit, unitIndex) => {
    const startIndex = unitIndex * 4;
    unit.imageIds = fallbackImages
      .slice(startIndex, startIndex + 4)
      .map((img) => img.id);
  });

  return {
    units: fallbackUnits,
    images: fallbackImages,
    location: institution?.name || '',
  };
}
