import type { CareerPathContent } from './types';

export const DEFAULT_CAREER_PATH_CONTENT: CareerPathContent = {
  title: 'Escolha o caminho que combina com você',
  subtitle: 'Aqui você encontra a trilha ideal para chegar no seu objetivo!',
  cards: [
    {
      id: 'graduation',
      title: 'Graduação',
      description:
        'Primeiro passo da sua carreira. Formando profissionais prontos para o mercado, com base teórica e prática na área escolhida.',
      icon: 'school',
      colorTheme: 'blue',
      modalities: [
        { id: 'presencial', label: 'Presencial' },
        { id: 'semipresencial', label: 'Semipresencial' },
        { id: 'ead', label: 'EAD' },
      ],
      ctaLabel: 'Veja cursos Graduação',
      ctaHref: '/cursos?tipo=graduacao',
    },
    {
      id: 'postgraduate',
      title: 'Pós-graduação',
      description:
        'Aprofunde seus conhecimentos. Voltada a quem já tem diploma superior e quer se especializar ou crescer na carreira.',
      icon: 'briefcase',
      colorTheme: 'red',
      modalities: [
        { id: 'ao-vivo', label: 'Ao vivo' },
        { id: 'digital', label: 'Digital' },
      ],
      ctaLabel: 'Veja cursos Pós-graduação',
      ctaHref: '/cursos?tipo=pos-graduacao',
    },
  ],
};
