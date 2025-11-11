import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AreasSelector } from '@/features/areas-selector';
import { CareerPath } from '@/features/career-path';
import { EntryFormsSection } from '@/features/entry-forms';
import { GeoCoursesSection } from '@/features/geo-courses';
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
      <EntryFormsSection />
      <InfrastructureSection />
      <Footer />
    </main>
  );
};

export default HomePage;
