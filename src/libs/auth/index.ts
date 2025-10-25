import NextAuth, { NextAuthConfig } from 'next-auth';
import Auth0 from 'next-auth/providers/auth0';
import { fetchAuth0UserInfo } from '../api/token';
import { SessionUser } from '../api/types';

const config: NextAuthConfig = {
  providers: [
    Auth0({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
      authorization: {
        params: { scope: 'openid profile email offline_access' },
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, account, trigger }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      const needsUserData = !token.user || trigger === 'signIn';
      const accessToken =
        account?.access_token || (token.accessToken as string | undefined);

      if (needsUserData && accessToken) {
        const info = await fetchAuth0UserInfo(accessToken);
        if (info) {
          const infoWithNickname = info as typeof info & { nickname?: string };
          const displayName =
            infoWithNickname.nickname && info.name?.includes('@')
              ? infoWithNickname.nickname
              : info.name;

          token.user = {
            id: info.sub || (token.sub as string) || '',
            name: displayName || null,
            email: info.email || null,
          };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const userData = token.user as SessionUser;
        if (userData.email) {
          session.user.id = userData.id;
          session.user.name = userData.name;
          session.user.email = userData.email;
        }
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
