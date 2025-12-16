/**
 * Strapi course transformers
 * Maps Portuguese field names from Strapi to English DTOs
 */

import type {
  CourseDetails,
  CoordinatorData,
  TeacherData,
  RelatedCourseData,
} from '@/features/course-details/types';
import { formatPrice } from '@/packages/utils/format-price';
import type {
  StrapiCoordenacao,
  StrapiCorpoDocente,
  StrapiCourse,
  StrapiOferta,
} from '../handlers/courses/types-strapi';

/**
 * Helper: Extract unique modalities from offerings
 */
function extractModalities(offerings: StrapiOferta[]) {
  const modalityMap = new Map();

  offerings.forEach((oferta) => {
    if (oferta.modalidade && !modalityMap.has(oferta.modalidade.id)) {
      modalityMap.set(oferta.modalidade.id, {
        id: oferta.modalidade.id,
        name: oferta.modalidade.nome || '',
        slug: oferta.modalidade.slug || '',
      });
    }
  });

  return Array.from(modalityMap.values());
}

/**
 * Helper: Extract unique units from offerings
 */
function extractUnits(offerings: StrapiOferta[]) {
  const unitMap = new Map();

  offerings.forEach((oferta) => {
    if (oferta.unidade && !unitMap.has(oferta.unidade.id)) {
      unitMap.set(oferta.unidade.id, {
        id: oferta.unidade.id,
        name: oferta.unidade.nome || '',
        city: oferta.unidade.cidade || '',
        state: oferta.unidade.estado || '',
        address: oferta.unidade.endereco || '',
      });
    }
  });

  return Array.from(unitMap.values());
}

/**
 * Helper: Transform offerings array
 */
function transformOfferings(offerings: StrapiOferta[]) {
  return offerings.map((oferta) => ({
    id: oferta.id,
    unitId: oferta.unidade.id,
    modalityId: oferta.modalidade.id,
    periodId: oferta.periodo.id,
    price: oferta.preco,
    duration: oferta.duracao,
    enrollmentOpen: oferta.inscricoes_abertas,
    unit: {
      id: oferta.unidade.id,
      name: oferta.unidade.nome || '',
      city: oferta.unidade.cidade || '',
      state: oferta.unidade.estado || '',
    },
    modality: {
      id: oferta.modalidade.id,
      name: oferta.modalidade.nome || '',
      slug: oferta.modalidade.slug || '',
    },
    period: {
      id: oferta.periodo.id,
      name: oferta.periodo.nome || '',
    },
  }));
}

/**
 * Transform Strapi course to CourseDetails DTO
 */
export function transformStrapiCourse(strapi: StrapiCourse): CourseDetails {
  // Extract active offerings
  const activeOfferings = strapi.ofertas?.filter((o) => o.ativo) || [];

  // Extract unique units and modalities
  const units = extractUnits(activeOfferings);
  const modalities = extractModalities(activeOfferings);

  // Calculate minimum price from active offerings
  const prices = activeOfferings
    .map((o) => o.preco)
    .filter((p): p is number => p !== null && p !== undefined);

  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  // Get duration from first active offering or default
  const firstOffering = activeOfferings[0];
  const duration =
    firstOffering?.duracao || strapi.duracao_padrao || 'Não informado';

  // Use "sobre" for description, fallback to "descricao"
  const description = strapi.sobre || strapi.descricao || '';

  // Use "capa" for featured image, fallback to "imagem_destaque"
  const featuredImage =
    strapi.capa?.url || strapi.imagem_destaque?.url || undefined;

  // Build base course details
  const courseDetails: CourseDetails = {
    id: strapi.id,
    name: strapi.nome,
    slug: strapi.slug,
    description,
    type: strapi.tipo || 'Não informado',
    workload: strapi.carga_horaria ? String(strapi.carga_horaria) : null,
    category: strapi.categoria
      ? { id: strapi.categoria.id, name: strapi.categoria.nome }
      : { id: 0, name: 'Graduação' },
    duration,
    priceFrom: minPrice ? formatPrice(minPrice) : null,
    modalities,
    units,
    offerings: transformOfferings(activeOfferings),
    featuredImage,
    methodology: strapi.metodologia || undefined,
    certificate: strapi.certificado || undefined,
  };

  // Add embedded coordinator if exists
  if (strapi.curso_coordenacao) {
    courseDetails.coordinator = {
      id: strapi.curso_coordenacao.id,
      name: strapi.curso_coordenacao.nome,
      description: strapi.curso_coordenacao.descricao || '',
      phone: strapi.curso_coordenacao.telefone || undefined,
      photo: strapi.curso_coordenacao.foto?.url,
    };
  }

  // Add embedded teacher if exists (as array for consistency)
  if (strapi.corpo_docente) {
    courseDetails.teachers = [
      {
        id: strapi.corpo_docente.id,
        name: strapi.corpo_docente.nome,
        role: strapi.corpo_docente.materia || 'Professor',
      },
    ];
  }

  return courseDetails;
}

/**
 * Transform Strapi coordinator to CoordinatorData DTO
 */
export function transformStrapiCoordinator(
  strapi: StrapiCoordenacao,
): CoordinatorData {
  return {
    id: strapi.id,
    name: strapi.nome,
    description: strapi.descricao,
    photo: strapi.foto?.url,
    email: strapi.email || undefined,
    phone: strapi.telefone || undefined,
  };
}

/**
 * Transform Strapi teacher to TeacherData DTO
 */
export function transformStrapiTeacher(
  strapi: StrapiCorpoDocente,
): TeacherData {
  return {
    id: strapi.id,
    name: strapi.nome,
    role: strapi.cargo,
    title: strapi.titulacao || undefined,
    photo: strapi.foto?.url,
  };
}

/**
 * Transform Strapi related course to RelatedCourseData DTO
 */
export function transformStrapiRelatedCourse(strapi: {
  id: number;
  nome: string;
  slug: string;
  tipo?: string | null;
  duracao_padrao?: string | null;
  ofertas?: StrapiOferta[];
}): RelatedCourseData {
  const firstOffering = strapi.ofertas?.find((o) => o.ativo);

  return {
    id: strapi.id,
    name: strapi.nome,
    slug: strapi.slug,
    type: strapi.tipo || 'Não informado',
    duration: strapi.duracao_padrao || 'Não informado',
    modality: firstOffering?.modalidade?.nome || 'Não informado',
    price: firstOffering?.preco || null,
  };
}
