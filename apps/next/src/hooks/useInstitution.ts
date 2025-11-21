import { useParams } from 'next/navigation';

export const useCurrentInstitution = () => {
  const { institution: institutionId } = useParams<{ institution: string }>();
  const institutionName = institutionId?.toUpperCase() || '';
  const institutionSlug = institutionId || '';
  return { institutionName, institutionId, institutionSlug };
};
