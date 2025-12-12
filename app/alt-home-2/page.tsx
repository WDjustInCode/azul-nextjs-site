import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import WhatSetsUsApartSection from './components/WhatSetsUsApartSection';
import ThreeStepSection from './components/ThreeStepSection';
import ReviewsSection from './components/ReviewsSection';
import FAQSection from './components/FAQSection';
import PopularLocationsSection from './components/PopularLocationsSection';
import Footer from './components/Footer';

export const metadata = {
  title: 'Azul Pools | Alternate Home',
  description:
    'Alternate home page matching the primary layout so you can customize independently.',
};

export default function AlternateHome() {
  return (
    <>
      <Header />
      <Hero />
      <ServicesSection />
      <WhatSetsUsApartSection />
      <ThreeStepSection />
      <ReviewsSection />
      <FAQSection />
      <PopularLocationsSection />
      <Footer />
    </>
  );
}

