import { Header } from '@/components/header';
import { GeoCoursesSection } from '@/features/geo-courses';
import { HomeHero } from '@/features/home-hero';
import { ModalitiesSection } from '@/features/home-hero/modalities-section';

const HomePage = () => {
  return (
    <main>
      <Header />
      <HomeHero />
      <GeoCoursesSection />
      <ModalitiesSection />
    </main>
  );
};

export default HomePage;
