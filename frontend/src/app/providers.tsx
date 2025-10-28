'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren, useState } from 'react';
import { Reshaped } from 'reshaped';
import { InstitutionThemeProvider } from '@/components/InstitutionThemeProvider';
import { makeQueryClient } from '@/libs/api/queryClient';
import 'reshaped/themes/slate/theme.css';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <SessionProvider>
      <Reshaped theme="slate">
        <InstitutionThemeProvider />
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === 'development' ? (
            <ReactQueryDevtools initialIsOpen={false} />
          ) : null}
        </QueryClientProvider>
      </Reshaped>
    </SessionProvider>
  );
}
