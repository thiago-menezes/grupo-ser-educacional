import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import { getMediaUrl } from '@/packages/utils';
import type { EMecResponseDTO } from './types';

const E_MEC_QUERY_KEY = ['e-mec'];

export type EMecData = {
  id: string;
  link: string | null;
  qrcodeUrl: string;
  qrcodeAlt?: string | null;
};

async function fetchEMec(institutionSlug: string): Promise<EMecData | null> {
  try {
    const data = await query<EMecResponseDTO>('/e-mecs', {
      institutionSlug,
    });

    if (!data.data || data.data.length === 0) {
      return null;
    }

    const item = data.data[0];

    return {
      id: String(item.id),
      link: item.link || null,
      qrcodeUrl: item.qrcodeUrl ? getMediaUrl(item.qrcodeUrl) : '',
      qrcodeAlt: item.qrcodeAlt,
    };
  } catch {
    return null;
  }
}

export function useEMec(institutionSlug: string) {
  return useQuery({
    queryKey: [...E_MEC_QUERY_KEY, institutionSlug],
    queryFn: () => fetchEMec(institutionSlug),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
