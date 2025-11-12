export function generateJsonLd(institution: string) {
  const institutionName = institution.toUpperCase();

  // TODO: Fetch institution data from Strapi to make JSON-LD dynamic
  // const institutionData = await fetchInstitutionData(institution);

  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: `${institutionName} - Centro Universitário`,
    alternateName: institutionName,
    url: `https://www.${institution}.edu.br`,
    logo: `https://www.${institution}.edu.br/logo.png`,
    description: `Centro Universitário oferecendo cursos de graduação, pós-graduação e técnicos. Conceito máximo MEC.`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
    telephone: '0800-281-9000',
    sameAs: [
      `https://www.facebook.com/${institutionName}`,
      `https://www.instagram.com/${institution}`,
      `https://www.linkedin.com/school/${institution}`,
    ],
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Grupo Ser Educacional',
    },
  };
}
