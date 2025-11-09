import { notFound } from 'next/navigation';
import { isValidInstitution } from '@/utils/verify-institution';

type InstitutionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
};

export default async function InstitutionLayout({
  children,
  params,
}: InstitutionLayoutProps) {
  const { institution } = await params;

  if (!institution) return null;

  if (!isValidInstitution(institution)) {
    return notFound();
  }

  return (
    <>
      <link rel="icon" href={`/favicons/${institution}.ico`} sizes="any" />
      {children}
    </>
  );
}
