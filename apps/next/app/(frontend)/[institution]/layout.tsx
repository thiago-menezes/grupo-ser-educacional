import { isValidInstitution } from '@grupo-ser/utils';
import { notFound } from 'next/navigation';
import { Footer, Header } from '@/components';
import { generateJsonLd, generateMetadata } from '@/seo';

type InstitutionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
};

export async function generateStaticParams() {
  // Temporarily only build UNAMA to avoid CMS timeout during build
  // TODO: Re-enable all institutions when CMS is available
  return [{ institution: 'unama' }];
}

// Force dynamic rendering to avoid build-time CMS calls
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

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
