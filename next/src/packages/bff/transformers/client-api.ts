import type { ClientApiUnit } from '../services/client-api';

/**
 * Transformed Unit DTO (English field names)
 */
export interface ClientUnit {
  id: number;
  name: string;
  state: string;
  city: string;
}

/**
 * Transform client API unit from Portuguese to English
 */
export function transformClientUnit(apiUnit: ClientApiUnit): ClientUnit {
  return {
    id: apiUnit.ID,
    name: apiUnit.Nome_Unidade,
    state: apiUnit.Estado,
    city: apiUnit.Cidade,
  };
}

/**
 * Transform array of units
 */
export function transformClientUnits(
  apiUnits: ClientApiUnit[],
): ClientUnit[] {
  return apiUnits.map(transformClientUnit);
}
