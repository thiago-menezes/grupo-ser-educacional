import { QueryClient } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import Providers from '@/app/providers';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const customRender = (
  ui: ReactElement,
  { ...options }: CustomRenderOptions = {},
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <Providers>{children}</Providers>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
export { createTestQueryClient };
