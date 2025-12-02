export type FAQItemDTO = {
  id: number;
  question: string;
  answer: string;
};

export type PerguntasFrequentesResponseDTO = {
  data: FAQItemDTO[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
