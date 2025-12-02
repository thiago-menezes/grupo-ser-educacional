import { notFound } from 'next/navigation';
import { Footer, Header } from '@/components';
import { isValidInstitution } from '@/packages/utils';
import { generateJsonLd, generateMetadata } from '@/seo';

type InstitutionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
};

export async function generateStaticParams() {
  // Generate static params for all known institutions to avoid build-time CMS calls
  // This allows the pages to be statically generated with fallback
  const institutions = [
    'unama',
    'ung',
    'uni7',
    'unifael',
    'uninassau',
    'uninorte',
  ];

  return institutions.map((institution) => ({
    institution,
  }));
}

// Use ISR for better performance in production
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

export { generateMetadata };

export default async function InstitutionLayout({
  children,
  params,
}: InstitutionLayoutProps) {
  const { institution } = await params;

  if (!institution) return null;

  if (!isValidInstitution(institution)) {
    return notFound();
  }

  // Wrap in try-catch to prevent build failures if CMS is unavailable
  let jsonLd;
  try {
    jsonLd = await generateJsonLd(institution);
  } catch {
    jsonLd = undefined;
  }

  return (
    <>
      <Header />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
      <Footer />
    </>
  );
}
