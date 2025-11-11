import type { InfrastructureContent } from './types';

export const DEFAULT_INFRASTRUCTURE_CONTENT: InfrastructureContent = {
  title: 'Conheça nossa infraestrutura',
  locationLabel: 'Unidades próximas a você',
  location: 'São José dos Campos',
  locationState: 'SP',
  viewAllButtonLabel: 'Ver todas as unidades',
  units: [
    {
      id: 'sao-jose-aquarios',
      name: 'Unidade São José - Aquários',
      isActive: true,
    },
    {
      id: 'sao-jose-sul',
      name: 'Unidade São José - Sul',
    },
    {
      id: 'sao-jose-centro',
      name: 'Unidade São José - Centro',
    },
  ],
  images: [
    {
      id: '1',
      src: 'https://placehold.co/1000x800.png',
      alt: 'Campus UNINASSAU - Entrada principal',
    },
    {
      id: '2',
      src: 'https://placehold.co/1000x800.png',
      alt: 'Estudantes no campus',
    },
    {
      id: '3',
      src: 'https://placehold.co/1000x800.png',
      alt: 'Portão de entrada da faculdade',
    },
    {
      id: '4',
      src: 'https://placehold.co/1000x800.png',
      alt: 'Prédio da faculdade',
    },
    {
      id: '5',
      src: 'https://placehold.co/1000x800.png',
      alt: 'Entrada do campus',
    },
  ],
};
