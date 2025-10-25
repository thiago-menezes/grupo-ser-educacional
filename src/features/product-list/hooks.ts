import { useProductsQuery } from './api/query';
import { Product } from './api/types';

export function useProductList() {
  const query = useProductsQuery();

  const products: Product[] = query.data?.results ?? [];

  return {
    products,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
