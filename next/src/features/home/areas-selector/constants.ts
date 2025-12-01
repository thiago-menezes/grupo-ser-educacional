import type { AreasSelectorContent } from './types';

export const DEFAULT_AREAS_CONTENT: AreasSelectorContent = {
  areas: [
    {
      id: 'engineering',
      title: 'Engenharia & Tecnologia',
      slug: 'engenharia-tecnologia',
      imageUrl: '/area1.png',
      courses: [
        {
          id: 'engenharia-civil',
          name: 'Engenharia civil',
          slug: 'engenharia-civil',
        },
        {
          id: 'ads',
          name: 'Análise e desenvolvimento de sistemas',
          slug: 'analise-e-desenvolvimento-de-sistemas',
        },
        {
          id: 'ciencia-dados',
          name: 'Ciência de dados',
          slug: 'ciencia-de-dados',
        },
        {
          id: 'engenharia-mecanica',
          name: 'Engenharia mecânica',
          slug: 'engenharia-mecanica',
        },
      ],
    },
    {
      id: 'humanas',
      title: 'Ciências Humanas',
      slug: 'ciencias-humanas',
      imageUrl: '/area2.png',
      courses: [
        { id: 'jornalismo', name: 'Jornalismo', slug: 'jornalismo' },
        { id: 'geografia', name: 'Geografia', slug: 'geografia' },
        { id: 'pedagogia', name: 'Pedagogia', slug: 'pedagogia' },
        {
          id: 'publicidade',
          name: 'Publicidade e Propaganda',
          slug: 'publicidade-e-propaganda',
        },
      ],
    },
    {
      id: 'exatas',
      title: 'Ciências Exatas e da Terra',
      slug: 'ciencias-exatas',
      imageUrl: '/area3.png',
      courses: [
        { id: 'fisica', name: 'Física', slug: 'fisica' },
        { id: 'quimica', name: 'Química', slug: 'quimica' },
        { id: 'estatistica', name: 'Estatística', slug: 'estatistica' },
        { id: 'geologia', name: 'Geologia', slug: 'geologia' },
      ],
    },
    {
      id: 'saude',
      title: 'Ciências da Saúde',
      slug: 'ciencias-da-saude',
      imageUrl: '/area4.png',
      courses: [
        { id: 'enfermagem', name: 'Enfermagem', slug: 'enfermagem' },
        { id: 'fisioterapia', name: 'Fisioterapia', slug: 'fisioterapia' },
        { id: 'odontologia', name: 'Odontologia', slug: 'odontologia' },
        { id: 'farmacia', name: 'Farmácia', slug: 'farmacia' },
      ],
    },
  ],
};
