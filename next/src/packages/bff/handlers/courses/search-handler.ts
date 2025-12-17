/**
 * Handler de Busca de Cursos
 * Orquestra a busca, agregação, transformação e paginação de cursos
 */

import type { CoursesApiClient } from '../../services/courses-api/client';
import type { CoursesAPIParams } from '../../services/courses-api/types';
import type {
  CoursesSearchParams,
  CoursesSearchResponse,
  CourseCard,
  FiltersCount,
} from 'types/api/courses-search';
import { aggregateCourses } from './aggregator';
import { transformCoursesToCards } from '../../transformers/courses-search';

const DEFAULT_PER_PAGE = 12;

/**
 * Mapeia nível da UI para formato da API
 */
function mapNivelToAPI(nivel?: string): string | undefined {
  if (!nivel) return undefined;

  if (nivel === 'graduacao') {
    return 'Ensino Superior';
  }
  if (nivel === 'pos-graduacao') {
    return 'Pós-Graduação';
  }

  return undefined;
}

/**
 * Mapeia modalidade da UI para formato da API
 */
function mapModalidadeToAPI(modalidade: string): string {
  const lower = modalidade.toLowerCase();

  if (lower === 'presencial') return 'Presencial';
  if (lower === 'ead') return 'EAD';
  if (lower === 'semipresencial') return 'Semipresencial';

  return modalidade;
}

/**
 * Mapeia turno da UI para formato da API
 */
function mapTurnoToAPI(turno: string): string {
  const lower = turno.toLowerCase();

  if (lower === 'manha' || lower === 'manhã') return 'Matutino';
  if (lower === 'tarde') return 'Vespertino';
  if (lower === 'noite') return 'Noturno';
  if (lower === 'integral') return 'Integral';
  if (lower === 'virtual') return 'Virtual';

  return turno;
}

/**
 * Aplica filtros que não puderam ser feitos na API
 * (filtros múltiplos, duração, etc.)
 */
function applyClientSideFilters(
  courses: CourseCard[],
  params: CoursesSearchParams,
): CourseCard[] {
  let filtered = courses;

  // Filtro de modalidades (múltiplas)
  filtered = filtered.filter((course) =>
    course.modalities.some((m) => m.toLowerCase()),
  );

  // Filtro de turnos (múltiplos)
  filtered = filtered.filter((course) =>
    course.shifts.some((t) => t.toLowerCase()),
  );

  // Filtro de duração
  filtered = filtered.filter((course) => {
    const years = course.durationMonths / 12;
    return params.durations!.some((range) => {
      if (range === '1-2') return years >= 1 && years <= 2;
      if (range === '2-3') return years > 2 && years <= 3;
      if (range === '3-4') return years > 3 && years <= 4;
      if (range === '4+') return years > 4;
      return false;
    });
  });
  // Filtro de preço
  filtered = filtered.filter((course) => course.minPrice >= params.minPrice!);
  filtered = filtered.filter((course) => course.minPrice <= params.maxPrice!);

  return filtered;
}

/**
 * Calcula contadores de filtros para a UI
 */
function calculateFiltersCount(courses: CourseCard[]): FiltersCount {
  const filtersCount: FiltersCount = {
    modalities: {
      inPerson: 0,
      hybrid: 0,
      online: 0,
    },
    shifts: {
      morning: 0,
      afternoon: 0,
      evening: 0,
      fullTime: 0,
      virtual: 0,
    },
    durations: {
      '1-2': 0,
      '2-3': 0,
      '3-4': 0,
      '4+': 0,
    },
  };

  for (const course of courses) {
    // Contar modalidades
    course.modalities.forEach((m) => {
      const lower = m.toLowerCase();
      if (lower === 'in person') filtersCount.modalities.inPerson++;
      if (lower === 'hybrid') filtersCount.modalities.hybrid++;
      if (lower === 'online') filtersCount.modalities.online++;
    });

    // Contar turnos
    course.shifts.forEach((t) => {
      const lower = t.toLowerCase();
      if (lower === 'morning') filtersCount.shifts.morning++;
      if (lower === 'afternoon') filtersCount.shifts.afternoon++;
      if (lower === 'evening') filtersCount.shifts.evening++;
      if (lower === 'full time') filtersCount.shifts.fullTime++;
      if (lower === 'virtual') filtersCount.shifts.virtual++;
    });

    // Contar durações
    const years = course.durationMonths / 12;
    if (years >= 1 && years <= 2) filtersCount.durations['1-2']++;
    if (years > 2 && years <= 3) filtersCount.durations['2-3']++;
    if (years > 3 && years <= 4) filtersCount.durations['3-4']++;
    if (years > 4) filtersCount.durations['4+']++;
  }

  return filtersCount;
}

/**
 * Handler principal de busca de cursos
 */
export async function handleCoursesSearch(
  coursesApiClient: CoursesApiClient,
  params: CoursesSearchParams,
): Promise<CoursesSearchResponse> {
  const { page = 1, perPage = DEFAULT_PER_PAGE } = params;

  // 1. Montar parâmetros para a API fake
  // A API fake vai fazer filtros básicos (cidade, estado, modalidade única, etc.)
  const apiParams: CoursesAPIParams = {
    nivel_ensino: mapNivelToAPI(params.level),
    cidade: params.city,
    estado: params.state,
    curso_nome: params.course,
  };

  // Para modalidade, se houver apenas uma, passar para a API
  // Se houver múltiplas, vamos filtrar no cliente
  if (params.modalities && params.modalities.length === 1) {
    apiParams.modalidade = mapModalidadeToAPI(params.modalities[0]);
  }

  // Para turno, se houver apenas um, passar para a API
  if (params.shifts && params.shifts.length === 1) {
    apiParams.turno = mapTurnoToAPI(params.shifts[0]);
  }

  // 2. Buscar cursos na API fake
  const rawCourses = await coursesApiClient.fetchCourses(apiParams);

  // 3. Agregar cursos (agrupar por Curso_ID)
  const coursesAggregated = aggregateCourses(rawCourses);

  // 4. Transformar para formato do card
  let courses = transformCoursesToCards(coursesAggregated);

  // 5. Aplicar filtros do lado do cliente (modalidades múltiplas, turnos, duração, preço)
  courses = applyClientSideFilters(courses, params);

  // 6. Calcular contadores de filtros (antes da paginação)
  const filtersCount = calculateFiltersCount(courses);

  // 7. Aplicar paginação
  const total = courses.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const coursesPaginated = courses.slice(startIndex, endIndex);

  return {
    total,
    currentPage: page,
    totalPages,
    perPage,
    courses: coursesPaginated,
    filters: filtersCount,
  };
}
