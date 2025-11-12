declare namespace NodeJS {
  interface ProcessEnv {
    // API Configuration
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_STRAPI_URL?: string;
    NEXT_PUBLIC_APP_BASE_URL?: string;
    NEXT_PUBLIC_INSTITUTION?: string;

    // NextAuth
    AUTH_URL: string;
    AUTH_SECRET: string;
    AUTH_TRUST_HOST: string;

    // Auth0
    AUTH0_ISSUER: string;
    AUTH0_ID: string;
    AUTH0_SECRET: string;

    // Development
    MOCK_SERVER?: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
