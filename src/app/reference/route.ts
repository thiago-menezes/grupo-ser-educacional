import { ApiReference } from '@scalar/nextjs-api-reference';

const config: Parameters<typeof ApiReference>[0] = {
  url: '/openapi.yaml',
  theme: 'purple',
  layout: 'modern',
};

export const GET = ApiReference(config);
