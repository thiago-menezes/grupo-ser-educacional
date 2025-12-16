/**
 * Strapi handler for course details
 * Fetches course with embedded coordinator and teachers from Strapi
 */

import type { CourseDetails } from '@/features/course-details/types';
import type { StrapiClient } from '../../services/strapi/client';
import {
  transformStrapiCourse,
  transformStrapiRelatedCourse,
} from '../../transformers/course-strapi';
import type { StrapiCourseResponse } from './types-strapi';

export type CourseDetailsParams = {
  courseSku: string;
  courseSlug?: string;
};

/**
 * Handle course details request from Strapi
 * Course includes embedded coordinator and teaching staff
 */
export async function handleCourseDetailsFromStrapi(
  strapiClient: StrapiClient,
  params: CourseDetailsParams,
): Promise<CourseDetails> {
  console.log('[CourseDetails] Fetching from Strapi:', params);

  try {
    // Fetch course with all relations populated
    // Using publicationState=preview to get both published and draft content
    const courseResponse = await strapiClient.fetch<StrapiCourseResponse>(
      'courses',
      {
        filters: {
          sku: { $eq: params.courseSku },
        },
        populate: '*',
        params: { publicationState: 'preview' },
      },
    );

    // Validate course exists
    if (!courseResponse.data || courseResponse.data.length === 0) {
      throw new Error(`Course not found with SKU: ${params.courseSku}`);
    }

    const strapiCourse = courseResponse.data[0];

    console.log('[CourseDetails] Found course:', {
      id: strapiCourse.id,
      nome: strapiCourse.nome,
      sku: strapiCourse.sku,
      hasDescription: !!(strapiCourse.sobre || strapiCourse.descricao),
      hasCoordinator: !!strapiCourse.curso_coordenacao,
      hasTeacher: !!strapiCourse.corpo_docente,
      hasCover: !!(strapiCourse.capa || strapiCourse.imagem_destaque),
      hasMethodology: !!strapiCourse.metodologia,
      hasCertificate: !!strapiCourse.certificado,
    });

    // Transform course data (includes embedded coordinator and teacher)
    const courseDetails = transformStrapiCourse(strapiCourse);

    console.log('[CourseDetails] After transformation:', {
      hasMethodology: !!courseDetails.methodology,
      hasCertificate: !!courseDetails.certificate,
      methodologyLength: courseDetails.methodology?.length,
      certificateLength: courseDetails.certificate?.length,
    });

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
        transformStrapiRelatedCourse,
      );
      console.log('[CourseDetails] Related courses added:', {
        count: courseDetails.relatedCourses.length,
      });
    }

    return courseDetails;
  } catch (error) {
    console.error('[CourseDetails] Error fetching from Strapi:', error);
    throw error;
  }
}
