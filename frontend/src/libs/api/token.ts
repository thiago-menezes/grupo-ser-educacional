import type { Profile, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { AccessTokenSession } from './types';

export async function getAccessToken(): Promise<string | null> {
  try {
    const session = (await getSession()) as AccessTokenSession | null;
    return session?.accessToken ?? null;
  } catch {
    return null;
  }
}

export type BasicProfile = {
  sub?: string;
  name?: string | null;
  email?: string | null;
  nickname?: string | null;
};

export function mapToSessionUser(
  profile?: Profile | null,
  user?: User | null,
  token?: JWT,
): { id: string; name?: string | null; email?: string | null } | undefined {
  const p = (profile ?? undefined) as BasicProfile | undefined;
  const id =
    p?.sub ??
    (user as { id?: string | null } | null | undefined)?.id ??
    token?.sub ??
    undefined;
  if (!id) return undefined;
  const name = p?.name ?? user?.name ?? null;
  const email =
    p?.email ??
    (user as { email?: string | null } | null | undefined)?.email ??
    null;
  return { id, name, email };
}

export async function fetchAuth0UserInfo(
  accessToken: string,
): Promise<BasicProfile | null> {
  const issuer = process.env.AUTH0_ISSUER?.trim();
  if (!issuer) return null;
  try {
    const res = await fetch(`${issuer}/userinfo`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as BasicProfile;
  } catch {
    return null;
  }
}
