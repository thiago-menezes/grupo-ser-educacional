import { Header } from '@/components/header';
import { GeoCoursesSection } from '@/features/geo-courses';
import { HomeHero } from '@/features/home-hero';

const HomePage = () => {
  return (
    <main>
      <Header />
      <HomeHero />
      <GeoCoursesSection />
    </main>
  );
};

export default HomePage;
