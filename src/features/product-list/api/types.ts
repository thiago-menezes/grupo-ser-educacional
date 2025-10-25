export type UseProductsQueryProps = {
  category?: string;
  minPrice?: number;
  page?: number;
  pageSize?: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inStock: boolean;
  rating: number;
  images?: string[];
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductSearchParams = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
};

export type ProductSearchResponse = {
  results: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    applied: Partial<ProductSearchParams>;
    available: {
      categories: string[];
      priceRange: { min: number; max: number };
      tags: string[];
    };
  };
};
