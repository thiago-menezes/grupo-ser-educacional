export type UsePaginationOptions = {
  totalItems: number;
  containerRef: React.RefObject<HTMLDivElement>;
};

export type PaginationState = {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  goToPage: (page: number) => void;
};
