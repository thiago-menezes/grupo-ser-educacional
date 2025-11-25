'use client';

import { CityProvider } from '@/contexts/city';
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

const HomePage = () => {
  return (
    <CityProvider>
      <main>
        <HeroSection />
        <GeoCoursesSection />
        <PromotionalBanners />
        <ModalitiesSection />
        <AreasSelector />
        <CareerPath />
        <EntryMethodsSection />
        <GeoCoursesSection data={MOCK_POPULAR_COURSES_DATA} />
        <InfrastructureSection />
        <FAQSection />
      </main>
    </CityProvider>
  );
};

export default HomePage;
