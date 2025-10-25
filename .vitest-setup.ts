import { ReactNode } from 'react';
import { loadEnv } from 'vite';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

loadEnv('test', process.cwd());

vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: ReactNode }) => children,
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
}));
