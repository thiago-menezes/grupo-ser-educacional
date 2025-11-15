'use client';

import {
  AreasSelector,
  CareerPath,
  EntryMethodsSection,
  GeoCoursesSection,
  MOCK_POPULAR_COURSES_DATA,
  HeroSection,
  InfrastructureSection,
  ModalitiesSection,
  PromotionalBanners,
} from '@grupo-ser/frontend';

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
