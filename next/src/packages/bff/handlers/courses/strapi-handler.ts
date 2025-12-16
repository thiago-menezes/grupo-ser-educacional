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
  try {
    // Fetch course with all relations populated
    // Using publicationState=preview to get both published and draft content
    // Using deep populate to get all nested relations
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

    // Transform course data (includes embedded coordinator and teacher)
    const courseDetails = transformStrapiCourse(strapiCourse);

    // Add pedagogical project if exists
    if (strapiCourse.projeto_pedagogico) {
      courseDetails.pedagogicalProject = {
        content: strapiCourse.projeto_pedagogico,
      };
    }

    // Add job market areas if exist
    if (strapiCourse.areas_atuacao && strapiCourse.areas_atuacao.length > 0) {
      courseDetails.jobMarketAreas = strapiCourse.areas_atuacao;
    }

    // Add salary ranges if exist
    if (
      strapiCourse.faixas_salariais &&
      strapiCourse.faixas_salariais.length > 0
    ) {
      courseDetails.salaryRanges = strapiCourse.faixas_salariais;
    }

    // Add related courses if exist
    if (
      strapiCourse.cursos_relacionados &&
      strapiCourse.cursos_relacionados.length > 0
    ) {
      courseDetails.relatedCourses = strapiCourse.cursos_relacionados.map(
        transformStrapiRelatedCourse,
      );
    }

    return courseDetails;
  } catch (error) {
    console.error('[CourseDetails] Error fetching from Strapi:', error);
    throw error;
  }
}
