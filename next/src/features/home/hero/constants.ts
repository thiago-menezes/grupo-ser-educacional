import { HeroContent } from './types';

export const HOME_HERO_QUERY_KEY = ['home-hero'] as const;

export const DEFAULT_HERO_CONTENT: HeroContent = {
  backgroundImage: {
    url: 'https://placehold.co/1800x720.png',
    alternativeText: 'Hero banner background',
  },
  showCarouselControls: true,
  showQuickSearch: true,
};

export const CAROUSEL_CONFIG = {
  autoAdvanceInterval: 5000,
  transitionDuration: 300,
} as const;

export type CityOption = {
  label: string;
  value: string;
  city: string;
  state: string;
};

export const MOCK_CITIES: CityOption[] = [
  {
    label: 'Recife - PE',
    value: 'city:recife-state:pe',
    city: 'Recife',
    state: 'PE',
  },
  {
    label: 'Campo Grande - MS',
    value: 'city:campo-grande-state:ms',
    city: 'Campo Grande',
    state: 'MS',
  },
  {
    label: 'São Paulo - SP',
    value: 'city:sao-paulo-state:sp',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    label: 'Rio de Janeiro - RJ',
    value: 'city:rio-de-janeiro-state:rj',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  {
    label: 'Salvador - BA',
    value: 'city:salvador-state:ba',
    city: 'Salvador',
    state: 'BA',
  },
  {
    label: 'Brasília - DF',
    value: 'city:brasilia-state:df',
    city: 'Brasília',
    state: 'DF',
  },
  {
    label: 'Fortaleza - CE',
    value: 'city:fortaleza-state:ce',
    city: 'Fortaleza',
    state: 'CE',
  },
  {
    label: 'Belo Horizonte - MG',
    value: 'city:belo-horizonte-state:mg',
    city: 'Belo Horizonte',
    state: 'MG',
  },
  {
    label: 'Manaus - AM',
    value: 'city:manaus-state:am',
    city: 'Manaus',
    state: 'AM',
  },
  {
    label: 'Região Metropolitana de Campinas - SP',
    value: 'city:região-metropolitana-de-campinas-state:sp',
    city: 'Região Metropolitana de Campinas',
    state: 'SP',
  },
];
