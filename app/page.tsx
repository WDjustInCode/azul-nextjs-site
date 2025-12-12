import AltHeader from './components/AltHeader';
import AltHero from './components/AltHero';
import AltServicesSection from './components/AltServicesSection';
import AltWhatSetsUsApartSection from './components/AltWhatSetsUsApartSection';
import AltThreeStepSection from './components/AltThreeStepSection';
import AltReviewsSection from './components/AltReviewsSection';
import AltFAQSection from './components/AltFAQSection';
import AltPopularLocationsSection from './components/AltPopularLocationsSection';
import AltFooter from './components/AltFooter';

export const metadata = {
  title: 'Azul Pools | Home',
  description: 'Azul Pools - Professional pool services',
};

export default function Home() {
  return (
    <>
      <AltHeader />
      <AltHero />
      <AltServicesSection />
      <AltWhatSetsUsApartSection />
      <AltThreeStepSection />
      <AltReviewsSection />
      <AltFAQSection />
      <AltPopularLocationsSection />
      <AltFooter />
    </>
  );
}
