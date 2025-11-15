export type CarouselControlsProps = {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  isAutoAdvancing?: boolean;
  onToggleAutoAdvance?: (enabled: boolean) => void;
};
