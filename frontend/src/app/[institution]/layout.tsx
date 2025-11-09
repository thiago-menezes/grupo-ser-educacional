import { notFound } from 'next/navigation';
import { isValidInstitution } from '@/config/institutions';

type InstitutionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
};

export default async function InstitutionLayout({
  children,
  params,
}: InstitutionLayoutProps) {
  const { institution } = await params;

  if (!isValidInstitution(institution)) {
    return notFound();
  }

  return (
    <>
      <link rel="icon" href={`/favicon/${institution}.ico`} sizes="any" />
      {children}
    </>
  );
}
