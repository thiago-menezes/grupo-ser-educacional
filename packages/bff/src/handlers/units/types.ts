export interface UnitsQueryParams {
  institutionSlug: string;
}

export type StrapiUnitsResponse = {
  data: Array<{
    id: number;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    photos: Array<{ id: number; url: string }>;
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