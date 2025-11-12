import type { InfrastructureContent } from './types';

export const MOCK_INFRASTRUCTURE_CONTENT: InfrastructureContent = {
  location: 'São José dos Campos',
  locationState: 'SP',
  units: [
    {
      id: 'sao-jose-aquarios',
      name: 'Unidade São José - Aquários',
      isActive: true,
      coordinates: {
        lat: -23.1791,
        lng: -45.8872,
      },
      imageIds: ['1', '2', '3', '4', '5'],
    },
    {
      id: 'sao-jose-sul',
      name: 'Unidade São José - Sul',
      coordinates: {
        lat: -23.1944,
        lng: -45.8844,
      },
      imageIds: ['3', '4', '5', '1', '2'],
    },
    {
      id: 'sao-jose-centro',
      name: 'Unidade São José - Centro',
      coordinates: {
        lat: -23.1794,
        lng: -45.8878,
      },
      imageIds: ['5', '1', '2', '3', '4'],
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
