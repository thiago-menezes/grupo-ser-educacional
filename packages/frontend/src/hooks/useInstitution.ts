import { useParams } from 'next/navigation';

export const useCurrentInstitution = () => {
  const { institution: institutionId } = useParams<{ institution: string }>();
  const institutionName = institutionId.toUpperCase();
  return { institutionName, institutionId };
};
