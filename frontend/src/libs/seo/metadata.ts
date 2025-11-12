import { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const referer = headersList.get('referer');
  const institution = referer?.split(`${process.env.APP_BASE_URL}/`)[1];

  if (!institution) {
    return {
      title: 'Grupo SER - Portal Institucional',
      description: 'Portal multi-institucional do Grupo SER Educacional',
    };
  }

  const formattedName =
    institution.charAt(0).toUpperCase() + institution.slice(1);

  return {
    title: `${formattedName} - Centro Universitário | Graduação, Pós-Graduação e Cursos Técnicos`,
    description: `Centro Universitário oferecendo cursos de graduação, pós-graduação e técnicos. Conceito máximo MEC.`,
    openGraph: {
      title: `${formattedName} - Faculdade com Conceito Máximo MEC`,
      description: `Estude na ${formattedName}: cursos de graduação, pós-graduação e MBA. Infraestrutura moderna e professores qualificados. Bolsas disponíveis.`,
      url: `https://www.${institution}.edu.br`,
      siteName: institution,
      type: 'website',
      locale: 'pt_BR',
      images: [
        {
          url: `https://www.${institution}.edu.br/logo.png`,
          width: 1200,
          height: 630,
          alt: `${formattedName} - Centro Universitário`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedName} - Líder em Educação Superior`,
      description: `Confie na ${formattedName}. Graduação, pós-graduação EAD, cursos técnicos. Conceito máximo MEC. Confira bolsas e financiamento.`,
      images: [`https://www.${institution}.edu.br/logo.png`],
    },
    alternates: {
      canonical: `https://www.${institution}.edu.br`,
      languages: {
        'pt-BR': `https://www.${institution}.edu.br`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'seu-codigo-google-search-console',
    },
    category: 'education',
    other: {
      'article:publisher': `https://www.facebook.com/${institution}`,
      'article:author': formattedName,
    },
  };
}
