export type PerguntasFrequentesItemDTO = {
  id: number;
  question: string | null;
  answer: string | null;
};

export type PerguntasFrequentesResponseDTO = {
  data: PerguntasFrequentesItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type PerguntasFrequentesErrorDTO = {
  error: string;
  message?: string;
};
