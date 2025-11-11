export type InfrastructureImage = {
  id: string;
  src: string;
  alt: string;
};

export type InfrastructureUnit = {
  id: string;
  name: string;
  isActive?: boolean;
};

export type InfrastructureContent = {
  title: string;
  locationLabel: string;
  location: string;
  locationState: string;
  viewAllButtonLabel: string;
  units: InfrastructureUnit[];
  images: InfrastructureImage[];
};

export type InfrastructureSectionProps = {
  content?: InfrastructureContent;
};

export type ImageModalProps = {
  active: boolean;
  image: InfrastructureImage | null;
  onClose: () => void;
};
