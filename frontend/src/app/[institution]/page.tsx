import { Header } from '@/components/header';
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
    </main>
  );
};

export default HomePage;
