/**
 * Strapi field transformers
 * Maps Portuguese field names from Strapi to English DTOs
 */

export interface StrapiInstitution {
  id: number;
  documentId: string;
  slug: string;
  nome: string | null;
  codigo?: string | null;
  cidadePadrao?: string | null;
  estadoPadrao?: string | null;
  ativo?: boolean | null;
  descricao?: string | null;
  site?: string | null;
  corPrimaria?: string | null;
  corSecundaria?: string | null;
  logo?: any;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

export interface Institution {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  code?: string | null;
  defaultCity?: string | null;
  defaultState?: string | null;
  active?: boolean;
  description?: string | null;
  logo?: any;
  website?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export function transformInstitution(
  strapi: StrapiInstitution,
): Institution {
  return {
    id: strapi.id,
    documentId: strapi.documentId,
    name: strapi.nome || '',
    slug: strapi.slug,
    code: strapi.codigo || null,
    defaultCity: strapi.cidadePadrao || null,
    defaultState: strapi.estadoPadrao || null,
    active: strapi.ativo ?? true,
    description: strapi.descricao || null,
    logo: strapi.logo,
    website: strapi.site || null,
    primaryColor: strapi.corPrimaria || null,
    secondaryColor: strapi.corSecundaria || null,
  };
}

export interface StrapiUnit {
  id: number;
  documentId: string;
  nome: string | null;
  endereco: string | null;
  latitude: number;
  longitude: number;
  fotos?: any[];
  instituicao?: StrapiInstitution;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

export interface Unit {
  id: number;
  documentId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photos?: any[];
  institution?: Institution;
}

export function transformUnit(strapi: StrapiUnit): Unit {
  return {
    id: strapi.id,
    documentId: strapi.documentId,
    name: strapi.nome || '',
    address: strapi.endereco || '',
    latitude: strapi.latitude,
    longitude: strapi.longitude,
    photos: strapi.fotos || [],
    institution: strapi.instituicao
      ? transformInstitution(strapi.instituicao)
      : undefined,
  };
}
