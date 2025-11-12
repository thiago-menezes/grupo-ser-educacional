export type ModalityBadge = {
  id: string;
  label: string;
};

export type CareerPathCard = {
  id: string;
  title: string;
  description: string;
  icon: 'school' | 'briefcase';
  colorTheme: 'blue' | 'red';
  modalities: ModalityBadge[];
  ctaLabel: string;
  ctaHref: string;
};

export type CareerPathContent = {
  cards: CareerPathCard[];
};

export type CareerPathProps = {
  content?: CareerPathContent;
};
