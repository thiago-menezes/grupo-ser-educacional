'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useParams } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { Reshaped } from 'reshaped';
import { makeQueryClient } from '@/libs/api/queryClient';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => makeQueryClient());
  const { institution = 'grupo-ser' } = useParams<{ institution: string }>();
  const [delayToRender, setDelayToRender] = useState(true);

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setDelayToRender(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  if (delayToRender) return <></>;

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
