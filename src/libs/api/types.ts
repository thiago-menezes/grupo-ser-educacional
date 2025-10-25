export type AccessTokenSession = { accessToken?: string };

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
};
