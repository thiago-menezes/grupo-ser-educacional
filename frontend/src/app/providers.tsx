'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useParams } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren, useState } from 'react';
import { Reshaped } from 'reshaped';
import { makeQueryClient } from '@/libs/api/queryClient';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => makeQueryClient());
  const { institution } = useParams<{ institution: string }>();

  return (
    <SessionProvider>
      <Reshaped theme={institution}>
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
