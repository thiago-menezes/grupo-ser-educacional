import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { useCurrentInstitution } from '@/hooks';
import { CourseDetails } from '../types';

export const useCourseDetailsContent = (course: CourseDetails) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [selectedModalityId, setSelectedModalityId] = useState<number | null>(
    null,
  );
  const [selectedAdmissionFormId, setSelectedAdmissionFormId] = useState<
    string | null
  >(null);

  const { institutionSlug } = useCurrentInstitution();

  // Initialize selected modality based on URL params
  useEffect(() => {
    const modalityParam = searchParams.get('modality');
    let selectedId: number | null = null;

    if (modalityParam) {
      // Find modality by slug
      const modalityBySlug = course.modalities.find(
        (m) => m.slug === modalityParam,
      );
      if (modalityBySlug) {
        selectedId = modalityBySlug.id;
      } else {
        // Try to find by ID if slug doesn't match
        const modalityById = course.modalities.find(
          (m) => m.id.toString() === modalityParam,
        );
        if (modalityById) {
          selectedId = modalityById.id;
        }
      }
    }

    if (!selectedId) {
      // Default to EAD if no valid modality in URL
      const eadModality = course.modalities.find((m) => m.slug === 'ead');
      if (eadModality) {
        selectedId = eadModality.id;
      } else {
        // Fallback to first available modality
        selectedId = course.modalities[0]?.id || null;
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedModalityId(selectedId);
  }, [course.modalities, searchParams]);

  // Initialize selected admission form from URL params
  useEffect(() => {
    const admissionFormParam = searchParams.get('admissionForm');
    startTransition(() => {
      if (admissionFormParam) {
        setSelectedAdmissionFormId(admissionFormParam);
      } else {
        // Default to first form if no param (will update URL when user selects)
        setSelectedAdmissionFormId('vestibular');
      }
    });
  }, [searchParams]);

  // Handler to update modality query parameter
  const handleModalityChange = useCallback(
    (modalityId: number) => {
      setSelectedModalityId(modalityId);
      const selectedModality = course.modalities.find(
        (m) => m.id === modalityId,
      );
      if (selectedModality) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('modality', selectedModality.slug);
        router.push(`${pathname}?${params.toString()}`);
      }
    },
    [course.modalities, router, pathname, searchParams],
  );

  const breadcrumbItems = [
    { label: 'Início', href: `/${institutionSlug}` },
    { label: 'Cursos', href: `/${institutionSlug}/cursos` },
    { label: course.name },
  ];

  // Handler to update admission form query parameter
  const handleAdmissionFormChange = useCallback(
    (formId: string) => {
      setSelectedAdmissionFormId(formId);
      const params = new URLSearchParams(searchParams.toString());
      params.set('admissionForm', formId);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return {
    breadcrumbItems,
    isCurriculumModalOpen,
    setIsCurriculumModalOpen,
    selectedModalityId,
    setSelectedModalityId,
    selectedAdmissionFormId,
    setSelectedAdmissionFormId,
    handleModalityChange,
    handleAdmissionFormChange,
  };
};
