import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AreasSelector } from '@/features/areas-selector';
import { CareerPath } from '@/features/career-path';
import { EntryMethodsSection } from '@/features/entry-methods';
import {
  GeoCoursesSection,
  MOCK_POPULAR_COURSES_DATA,
} from '@/features/geo-courses';
import { HomeHero } from '@/features/home-hero';
import { InfrastructureSection } from '@/features/infrastructure';
import { ModalitiesSection } from '@/features/modalities-section';
import { PromotionalBanners } from '@/features/promotional-banners';

const HomePage = () => {
  return (
    <main>
      <Header />
      <HomeHero />
      <GeoCoursesSection />
      <PromotionalBanners />
      <ModalitiesSection />
      <AreasSelector />
      <CareerPath />
      <EntryMethodsSection />
      <GeoCoursesSection data={MOCK_POPULAR_COURSES_DATA} />
      <InfrastructureSection />
      <Footer />
    </main>
  );
};

export default HomePage;
