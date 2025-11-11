import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { AreasSelector } from '@/features/areas-selector';
import { GeoCoursesSection } from '@/features/geo-courses';
import { HomeHero } from '@/features/home-hero';
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
      <Footer />
    </main>
  );
};

export default HomePage;
