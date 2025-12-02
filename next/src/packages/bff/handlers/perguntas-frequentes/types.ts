export type PerguntasFrequentesQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiPerguntaFrequente = {
  id: number;
  documentId: string;
  Pergunta: string;
  Resposta: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  instituicao?: {
    id: number;
    documentId: string;
    slug: string;
    nome: string;
  } | null;
};

export type StrapiPerguntasFrequentesResponse = {
  data: StrapiPerguntaFrequente[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
