import type { CourseDetails } from './types';

export const MOCK_COURSE_DETAILS: CourseDetails = {
  id: 1,
  name: 'Ciência de dados',
  slug: 'ciencia-de-dados',
  description:
    'Transforme dados em decisões estratégicas, o curso de Ciência de Dados forma profissionais preparados para atuar na área mais promissora da era digital, onde tecnologia, estatística e negócios se encontram. Você aprenderá a coletar, analisar e interpretar grandes volumes de dados para gerar insights que impulsionam resultados em empresas de todos os setores. Durante a graduação, o aluno desenvolve habilidades em programação, inteligência artificial, machine learning e visualização de dados, utilizando ferramentas usadas no mercado. Ao final, estará pronto para atuar como Cientista de Dados, Analista de BI, Engenheiro de Dados ou em cargos estratégicos que exigem pensamento analítico e domínio tecnológico. Porque hoje, quem entende dados, entende o futuro.',
  type: 'Bacharelado',
  workload: '3200',
  category: {
    id: 1,
    name: 'Tecnologia',
  },
  duration: '5 anos (10 semestres)',
  priceFrom: 'R$ 812,07',
  modalities: [
    { id: 1, name: 'Presencial', slug: 'presencial' },
    { id: 2, name: 'Semipresencial', slug: 'semipresencial' },
    { id: 3, name: 'Digital (EAD)', slug: 'ead' },
    { id: 4, name: 'Ao vivo', slug: 'ao-vivo' },
  ],
  units: [
    {
      id: 1,
      name: 'Unidade Aquarius',
      city: 'São José dos Campos',
      state: 'SP',
      address: 'Av. Aquarius, 123',
    },
    {
      id: 2,
      name: 'Polo São José - Sul',
      city: 'São José dos Campos',
      state: 'SP',
      address: 'Rua Sul, 456',
    },
    {
      id: 3,
      name: 'Polo São José - Centro',
      city: 'São José dos Campos',
      state: 'SP',
      address: 'Av. Centro, 789',
    },
  ],
  offerings: [
    {
      id: 1,
      unitId: 1,
      modalityId: 1,
      periodId: 1,
      price: 81207,
      duration: '5 anos (10 semestres)',
      enrollmentOpen: true,
      unit: {
        id: 1,
        name: 'Unidade Aquarius',
        city: 'São José dos Campos',
        state: 'SP',
      },
      modality: {
        id: 1,
        name: 'Presencial',
        slug: 'presencial',
      },
      period: {
        id: 1,
        name: 'Matutino',
      },
    },
    {
      id: 2,
      unitId: 1,
      modalityId: 1,
      periodId: 2,
      price: 85000,
      duration: '5 anos (10 semestres)',
      enrollmentOpen: true,
      unit: {
        id: 1,
        name: 'Unidade Aquarius',
        city: 'São José dos Campos',
        state: 'SP',
      },
      modality: {
        id: 1,
        name: 'Presencial',
        slug: 'presencial',
      },
      period: {
        id: 2,
        name: 'Noturno',
      },
    },
    {
      id: 3,
      unitId: 1,
      modalityId: 2,
      periodId: 1,
      price: 75000,
      duration: '5 anos (10 semestres)',
      enrollmentOpen: true,
      unit: {
        id: 1,
        name: 'Unidade Aquarius',
        city: 'São José dos Campos',
        state: 'SP',
      },
      modality: {
        id: 2,
        name: 'Semipresencial',
        slug: 'semipresencial',
      },
      period: {
        id: 1,
        name: 'Matutino',
      },
    },
  ],
};

export const MOCK_SALARY_RANGES = [
  {
    level: 'Júnior',
    range: 'R$ 4mil - R$ 7mil',
    description: 'Salário médio no Brasil',
    icon: 'currency-dollar' as const,
  },
  {
    level: 'Pleno',
    range: 'R$ 8mil - R$ 12mil',
    description: 'Salário médio no Brasil',
    icon: 'map-pin' as const,
  },
  {
    level: 'Sênior',
    range: 'R$ 13mil - R$ 18mil',
    description: 'Salário médio no Brasil',
    icon: 'briefcase' as const,
  },
];

export const MOCK_JOB_MARKET_AREAS = [
  'Análise e Ciência de Dados',
  'Machine Learning',
  'Engenharia de Dados',
  'Business Intelligence (BI)',
  'Inteligência Artificial',
];

export const MOCK_FAQ_ITEMS = [
  {
    id: 1,
    question: 'O curso de Ciência de dados possui estágio obrigatório?',
    answer:
      'Sim, o curso possui estágio obrigatório que deve ser realizado a partir do 6º semestre. O estágio é uma oportunidade para aplicar os conhecimentos adquiridos em um ambiente profissional real.',
  },
  {
    id: 2,
    question:
      'O curso de Ciência de dados possui PROUNI, FIES ou algum financiamento?',
    answer:
      'Sim, o curso aceita PROUNI e FIES. Além disso, oferecemos financiamento estudantil através do Bradesco, que permite parcelar até 100% do valor do curso. Entre em contato conosco para mais informações sobre as condições.',
  },
  {
    id: 3,
    question: 'Qual a duração do curso de Ciência de dados?',
    answer:
      'O curso de Ciência de Dados tem duração de 5 anos (10 semestres) e é oferecido em modalidade presencial, semipresencial, digital (EAD) e ao vivo.',
  },
  {
    id: 4,
    question: 'Quais são as áreas de atuação do profissional formado?',
    answer:
      'O profissional formado em Ciência de Dados pode atuar em diversas áreas como Análise e Ciência de Dados, Machine Learning, Engenharia de Dados, Business Intelligence (BI), Inteligência Artificial, além de pesquisa, consultoria e desenvolvimento de soluções tecnológicas.',
  },
  {
    id: 5,
    question: 'O curso é reconhecido pelo MEC?',
    answer:
      'Sim, o curso é reconhecido pelo MEC e possui nota 4 na avaliação do órgão. Você pode consultar o cadastro da instituição no e-MEC através do QR code disponível no rodapé do site.',
  },
  {
    id: 6,
    question: 'Como funciona o processo seletivo?',
    answer:
      'O processo seletivo pode ser realizado através de Vestibular online, utilização de notas do ENEM dos últimos 5 anos, Transferência de outra instituição ou utilização de outro diploma de nível superior.',
  },
];

export const MOCK_INFRASTRUCTURE_IMAGES = [
  {
    unitId: 1,
    unitName: 'Unidade São José - Aquarius',
    images: [
      {
        id: 1,
        src: '/default-image.png',
        alt: 'Laboratório de informática',
      },
      {
        id: 2,
        src: '/default-image.png',
        alt: 'Biblioteca',
      },
      {
        id: 3,
        src: '/default-image.png',
        alt: 'Sala de aula',
      },
      {
        id: 4,
        src: '/default-image.png',
        alt: 'Espaço de convivência',
      },
    ],
  },
  {
    unitId: 2,
    unitName: 'Polo São José - Sul',
    images: [
      {
        id: 5,
        src: '/default-image.png',
        alt: 'Laboratório de informática',
      },
      {
        id: 6,
        src: '/default-image.png',
        alt: 'Biblioteca',
      },
      {
        id: 7,
        src: '/default-image.png',
        alt: 'Sala de aula',
      },
    ],
  },
  {
    unitId: 3,
    unitName: 'Polo São José - Centro',
    images: [
      {
        id: 8,
        src: '/default-image.png',
        alt: 'Laboratório de informática',
      },
      {
        id: 9,
        src: '/default-image.png',
        alt: 'Biblioteca',
      },
      {
        id: 10,
        src: '/default-image.png',
        alt: 'Sala de aula',
      },
    ],
  },
];

export const MOCK_RELATED_COURSES = [
  {
    id: 1,
    name: 'Ciências de dados',
    type: 'Bacharelado',
    duration: '5 anos (10 semestres)',
    modality: 'Presencial',
    price: 81207,
    slug: 'ciencias-de-dados',
  },
  {
    id: 2,
    name: 'Sociologia',
    type: 'Bacharelado',
    duration: '4 anos (8 semestres)',
    modality: 'Presencial',
    price: 32090,
    slug: 'sociologia',
  },
  {
    id: 3,
    name: 'Enfermagem',
    type: 'Bacharelado',
    duration: '5 anos (10 semestres)',
    modality: 'Presencial',
    price: 120040,
    slug: 'enfermagem',
  },
  {
    id: 4,
    name: 'Análise e desenvolvimento de sistemas',
    type: 'Tecnólogo',
    duration: '2,5 anos (5 semestres)',
    modality: 'Presencial',
    price: 45090,
    slug: 'analise-e-desenvolvimento-de-sistemas',
  },
];

export const MOCK_COORDINATOR = {
  name: 'Dr. Josué Claudio dos Santos Fagundes',
  description:
    'Josué Claudio dos Santos Fagundes é um profissional dedicado e experiente, coordenador do curso de Ciência de Dados. Sua paixão por dados e análise o impulsiona a inspirar e guiar os futuros cientistas de dados da UNINASSAU.',
  photo: null,
};

export const MOCK_TEACHERS = [
  { name: 'Prof. João Silva', role: 'Professor Titular' },
  { name: 'Prof. Maria Santos', role: 'Professora Associada' },
  { name: 'Prof. Pedro Oliveira', role: 'Professor Assistente' },
  { name: 'Prof. Ana Costa', role: 'Professora Adjunta' },
];

export function getMockCourseDetails(_slug: string): CourseDetails {
  // For now, return the same mock data regardless of slug
  // In the future, this could return different courses based on slug
  return MOCK_COURSE_DETAILS;
}
