'use client';

import { AreasSelector } from '@/features/home/areas-selector';
import { CareerPath } from '@/features/home/career-path';
import { EntryMethodsSection } from '@/features/home/entry-methods';
import {
  GeoCoursesSection,
  MOCK_POPULAR_COURSES_DATA,
} from '@/features/home/geo-courses';
import { HeroSection } from '@/features/home/hero';
import { InfrastructureSection } from '@/features/home/infrastructure';
import { ModalitiesSection } from '@/features/home/modalities-section';
import { PromotionalBanners } from '@/features/home/promotional-banners';

const HomePage = () => {
  return (
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
    </main>
  );
};

export default HomePage;
