/**
 * Strapi handler for course details
 * Fetches course, coordinator, and teachers from Strapi
 */

import type { StrapiClient } from '../../services/strapi/client';
import type { CourseDetails } from '@/features/course-details/types';
import type {
  StrapiCourseResponse,
  StrapiCoordinatorResponse,
  StrapiTeachersResponse,
} from './types-strapi';
import {
  transformStrapiCourse,
  transformStrapiCoordinator,
  transformStrapiTeacher,
  transformStrapiRelatedCourse,
} from '../../transformers/course-strapi';

export type CourseDetailsParams = {
  courseSku: string;
};

/**
 * Handle course details request from Strapi
 * Fetches course, coordinator, and teaching staff in parallel
 */
export async function handleCourseDetailsFromStrapi(
  strapiClient: StrapiClient,
  params: CourseDetailsParams
): Promise<CourseDetails> {
  console.log('[CourseDetails] Fetching from Strapi:', params);

  try {
    // Fetch course, coordinator, and teachers in parallel for performance
    const [courseResponse, coordinatorResponse, teachersResponse] =
      await Promise.all([
        // Fetch course with all nested relationships
        strapiClient.fetch<StrapiCourseResponse>('courses', {
          filters: {
            sku: { $eq: params.courseSku },
          },
          populate: {
            categoria: true,
            ofertas: {
              populate: {
                unidade: {
                  populate: ['instituicao'],
                },
                modalidade: true,
                periodo: true,
              },
            },
            imagem_destaque: true,
            cursos_relacionados: {
              populate: ['categoria', 'ofertas'],
            },
          },
        }),

        // Fetch coordinator (optional - may not exist)
        strapiClient.fetch<StrapiCoordinatorResponse>('coordenacaos', {
          filters: {
            curso: {
              sku: { $eq: params.courseSku },
            },
          },
          populate: ['foto'],
        }),

        // Fetch teaching staff (optional - may be empty)
        strapiClient.fetch<StrapiTeachersResponse>('corpo-docentes', {
          filters: {
            curso: {
              sku: { $eq: params.courseSku },
            },
          },
          populate: ['foto'],
          sort: ['ordem:asc', 'nome:asc'],
        }),
      ]);

    // Validate course exists
    if (!courseResponse.data || courseResponse.data.length === 0) {
      throw new Error(`Course not found with SKU: ${params.courseSku}`);
    }

    const strapiCourse = courseResponse.data[0];

    console.log('[CourseDetails] Found course:', {
      id: strapiCourse.id,
      nome: strapiCourse.nome,
      sku: strapiCourse.sku,
      ofertas: strapiCourse.ofertas?.length || 0,
      hasCoordinator: coordinatorResponse.data.length > 0,
      teachersCount: teachersResponse.data.length,
    });

    // Transform course data
    const courseDetails = transformStrapiCourse(strapiCourse);

    // Add coordinator if exists
    if (coordinatorResponse.data && coordinatorResponse.data.length > 0) {
      courseDetails.coordinator = transformStrapiCoordinator(
        coordinatorResponse.data[0]
      );
      console.log('[CourseDetails] Coordinator added:', {
        name: courseDetails.coordinator.name,
      });
    }

    // Add teachers if exist
    if (teachersResponse.data && teachersResponse.data.length > 0) {
      courseDetails.teachers = teachersResponse.data.map(
        transformStrapiTeacher
      );
      console.log('[CourseDetails] Teachers added:', {
        count: courseDetails.teachers.length,
      });
    }

    // Add pedagogical project if exists
    if (strapiCourse.projeto_pedagogico) {
      courseDetails.pedagogicalProject = {
        content: strapiCourse.projeto_pedagogico,
      };
      console.log('[CourseDetails] Pedagogical project added');
    }

    // Add job market areas if exist
    if (strapiCourse.areas_atuacao && strapiCourse.areas_atuacao.length > 0) {
      courseDetails.jobMarketAreas = strapiCourse.areas_atuacao;
      console.log('[CourseDetails] Job market areas added:', {
        count: courseDetails.jobMarketAreas.length,
      });
    }

    // Add salary ranges if exist
    if (
      strapiCourse.faixas_salariais &&
      strapiCourse.faixas_salariais.length > 0
    ) {
      courseDetails.salaryRanges = strapiCourse.faixas_salariais;
      console.log('[CourseDetails] Salary ranges added:', {
        count: courseDetails.salaryRanges.length,
      });
    }

    // Add related courses if exist
    if (
      strapiCourse.cursos_relacionados &&
      strapiCourse.cursos_relacionados.length > 0
    ) {
      courseDetails.relatedCourses = strapiCourse.cursos_relacionados.map(
        transformStrapiRelatedCourse
      );
      console.log('[CourseDetails] Related courses added:', {
        count: courseDetails.relatedCourses.length,
      });
    }

    // Add featured image if exists
    if (strapiCourse.imagem_destaque?.url) {
      courseDetails.featuredImage = strapiCourse.imagem_destaque.url;
      console.log('[CourseDetails] Featured image added');
    }

    return courseDetails;
  } catch (error) {
    console.error('[CourseDetails] Error fetching from Strapi:', error);
    throw error;
  }
}
