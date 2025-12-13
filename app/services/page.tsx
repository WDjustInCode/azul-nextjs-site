import AltHeaderStatic from '@/app/components/AltHeaderStatic';
import AltFooter from '@/app/components/AltFooter';
import ServicesOverview from './components/ServicesOverview';

export const metadata = {
  title: 'Azul Pools | Pool Care Services',
  description: 'Comprehensive pool services to keep your pool looking great & running efficiently.',
};

export default function ServicesPage() {
  return (
    <>
      <AltHeaderStatic />
      <ServicesOverview />
      <AltFooter />
    </>
  );
}

