import type { CourseCardData } from '@/components/course-card';
import { MOCK_COURSES_DTO } from '@/features/home/geo-courses/api/mocks';
import { transformCourseDTO } from '@/features/home/geo-courses/api/utils';
import { CourseDTO } from '../../home/geo-courses/api/types';

const BASE_COURSES_DTO = [
  ...MOCK_COURSES_DTO,
  {
    id: '7',
    name: 'Direito',
    category: 'Ciências Jurídicas',
    degree: 'Bacharelado',
    duration: '5 anos (10 semestres)',
    modalities: ['presencial', 'semipresencial'] as const,
    price: 98000,
    campus: {
      name: 'Unidade Aquarius',
      city: 'São José dos Campos',
      state: 'SP',
      coordinates: {
        latitude: -23.1813,
        longitude: -45.8877,
      },
    },
    slug: 'direito',
  },
  {
    id: '8',
    name: 'Medicina',
    category: 'Ciências da Saúde',
    degree: 'Bacharelado',
    duration: '6 anos (12 semestres)',
    modalities: ['presencial'] as const,
    price: 150000,
    campus: {
      name: 'Unidade Aquarius',
      city: 'São José dos Campos',
      state: 'SP',
      coordinates: {
        latitude: -23.1813,
        longitude: -45.8877,
      },
    },
    slug: 'medicina',
  },
];

// Transform base courses to CourseCardData
const BASE_COURSES: CourseCardData[] = BASE_COURSES_DTO.map((dto) =>
  transformCourseDTO(dto as CourseDTO),
);

// Generate 80 courses by repeating the 8 base courses 10 times
export const MOCK_COURSE_CARDS: CourseCardData[] = Array.from({ length: 10 })
  .flatMap((_, repeatIndex) =>
    BASE_COURSES.map((course) => ({
      ...course,
      id: `${course.id}-${repeatIndex}`,
      slug: `${course.slug}-${repeatIndex}`,
    })),
  )
  .slice(0, 80);
