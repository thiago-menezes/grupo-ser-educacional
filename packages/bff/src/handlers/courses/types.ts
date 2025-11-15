export interface CoursesQueryParams {
  institution?: string; // slug or id
  location?: string; // city as free text
  page?: number;
  perPage?: number;
  modality?: number;
  category?: number;
  enrollmentOpen?: boolean;
  period?: number; // Turno
  priceMin?: number;
  priceMax?: number;
  durationRange?: "1-2" | "2-3" | "3-4" | "4+";
  level?: "graduacao" | "pos-graduacao";
  course?: string; // course slug or id
}

export interface AutocompleteQueryParams {
  type: "cities" | "courses";
  q?: string;
}
