/**
 * Utility functions for working with mock data
 */

import type { Unit } from './index';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find units within a radius (in km) from given coordinates
 */
export function findUnitsWithinRadius(
  units: Unit[],
  centerLat: number,
  centerLon: number,
  radiusKm: number,
): Unit[] {
  return units.filter((unit) => {
    const distance = calculateDistance(
      centerLat,
      centerLon,
      unit.latitude,
      unit.longitude,
    );
    return distance <= radiusKm;
  });
}
