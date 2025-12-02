'use client';

import { InfrastructureSection } from '@/features';
import { AreasSelector } from '@/features/home/areas-selector';
import { CareerPath } from '@/features/home/career-path';
import { EntryMethodsSection } from '@/features/home/entry-methods';
import { FAQSection } from '@/features/home/faq-section';
import {
  GeoCoursesSection,
  MOCK_POPULAR_COURSES_DATA,
} from '@/features/home/geo-courses';
import { HeroSection } from '@/features/home/hero';
import { ModalitiesSection } from '@/features/home/modalities-section';
import { PromotionalBanners } from '@/features/home/promotional-banners';
import { useCurrentInstitution } from '@/hooks';

const HomePage = () => {
  const { institutionId } = useCurrentInstitution();

  return (
    <main>
      <HeroSection />
      <GeoCoursesSection />
      <PromotionalBanners institutionSlug={institutionId} />
      <ModalitiesSection />
      <AreasSelector />
      <CareerPath />
      <EntryMethodsSection />
      <GeoCoursesSection data={MOCK_POPULAR_COURSES_DATA} />
      <InfrastructureSection />
      <FAQSection />
    </main>
  );
};

export default HomePage;
