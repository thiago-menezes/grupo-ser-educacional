import type { DefaultSession } from 'next-auth';
import type { SessionUser } from '@/libs/api/types';

declare module 'next-auth' {
  interface Session {
    user: SessionUser & (DefaultSession['user'] extends infer U ? U : unknown);
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    user?: SessionUser;
  }
}
