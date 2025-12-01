export interface UnitsQueryParams {
  institutionSlug: string;
}

// Strapi response with Portuguese field names
export type StrapiUnitsResponse = {
  data: Array<{
    id: number;
    documentId: string;
    nome: string | null;
    endereco: string | null;
    latitude: number;
    longitude: number;
    fotos?: Array<{
      id: number;
      documentId: string;
      url: string;
      name?: string;
      alternativeText?: string | null;
      caption?: string | null;
      width?: number;
      height?: number;
      formats?: any;
      hash?: string;
      ext?: string;
      mime?: string;
      size?: number;
    }>;
    instituicao?: {
      id: number;
      documentId: string;
      slug: string;
      nome: string | null;
    };
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string | null;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
