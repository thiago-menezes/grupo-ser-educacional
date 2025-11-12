import { notFound } from 'next/navigation';
import { generateJsonLd } from '@/libs/seo/json-ld';
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

  const jsonLd = generateJsonLd(institution);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <link rel="icon" href={`/favicons/${institution}.ico`} sizes="any" />
      {children}
    </>
  );
}
