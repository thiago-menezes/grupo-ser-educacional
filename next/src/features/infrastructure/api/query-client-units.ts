import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';

/**
 * Client Units Response (from BFF)
 */
export interface ClientUnit {
  id: number;
  name: string;
  state: string;
  city: string;
}

export interface ClientUnitsResponse {
  data: ClientUnit[];
  meta: {
    total: number;
    institution: string;
    state: string;
    city: string;
  };
}

/**
 * Query hook for fetching units from client API
 */
export const useQueryClientUnits = (
  institution: string | undefined,
  state: string | undefined,
  city: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['client-api', 'units', institution, state, city],
    queryFn: () =>
      query<ClientUnitsResponse>('/units/client', {
        institution,
        state,
        city,
      }),
    enabled: enabled && !!institution && !!state && !!city,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
