import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs/api/axios';
import productListMock from './mock';
import { ProductSearchResponse, UseProductsQueryProps } from './types';

export const useProductsQuery = ({
  category,
  minPrice,
  page,
  pageSize,
}: UseProductsQueryProps = {}) => {
  return useQuery({
    queryKey: [productListMock.tags],
    queryFn: () =>
      query<ProductSearchResponse>(productListMock.path, {
        category,
        minPrice,
        page,
        pageSize,
      }),
  });
};
