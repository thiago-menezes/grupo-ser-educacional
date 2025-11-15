import { isValidInstitution } from '@grupo-ser/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { generateJsonLd, getSeoFromStrapi } from '@/libs/seo';

type InstitutionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ institution: string }>;
};

export async function generateStaticParams() {
  return [
    { institution: 'uninassau' },
    { institution: 'ung' },
    { institution: 'unama' },
    { institution: 'uninorte' },
    { institution: 'unifael' },
    { institution: 'uni7' },
    { institution: 'grupo-ser' },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ institution: string }>;
}): Promise<Metadata> {
  const { institution } = await params;
  const seoData = await getSeoFromStrapi(institution);
  return seoData?.metadata as Metadata;
}

export default async function InstitutionLayout({
  children,
  params,
}: InstitutionLayoutProps) {
  const { institution } = await params;

  if (!institution) return null;

  if (!isValidInstitution(institution)) {
    return notFound();
  }

  const jsonLd = await generateJsonLd(institution);

  return (
    <>
      <Header />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <link rel="icon" href={`/favicons/${institution}.ico`} sizes="any" />
      {children}
      <Footer />
    </>
  );
}
