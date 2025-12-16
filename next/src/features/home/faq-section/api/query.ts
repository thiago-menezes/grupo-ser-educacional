import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import type { FaqsResponseDTO } from './types';

const PERGUNTAS_FREQUENTES_QUERY_KEY = ['home', 'perguntas-frequentes'];

export type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

async function fetchPerguntasFrequentes(
  institutionSlug: string,
): Promise<FAQItem[]> {
  try {
    const data = await query<FaqsResponseDTO>('/faqs', { institutionSlug });

    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((item) => ({
      id: item.id,
      question: item.question ?? '',
      answer: item.answer ?? '',
    }));
  } catch {
    return [];
  }
}

export function usePerguntasFrequentes(institutionSlug: string) {
  return useQuery({
    queryKey: [...PERGUNTAS_FREQUENTES_QUERY_KEY, institutionSlug],
    queryFn: () => fetchPerguntasFrequentes(institutionSlug),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
