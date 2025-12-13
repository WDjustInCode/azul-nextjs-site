'use client';

import Image from 'next/image';
import styles from './ServicesOverview.module.css';

interface Service {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
}

const services: Service[] = [
  {
    id: 'pool-cleaning',
    title: 'Pool Cleaning',
    description: 'We clean your pool to the highest industry standards.',
    iconUrl: 'https://static.thenounproject.com/png/clean-pool-icon-4517497-512.png',
  },
  {
    id: 'filter-cleaning',
    title: 'Filter Cleaning',
    description: 'We make sure your filter keeps your pool water safe.',
    iconUrl: 'https://static.thenounproject.com/png/pool-filter-icon-4517488-512.png',
  },
  {
    id: 'algae-removal',
    title: 'Algae Removal',
    description: 'Prevent, control and remove any algae & mold.',
    iconUrl: 'https://static.thenounproject.com/png/algae-icon-7789070-512.png',
  },
  {
    id: 'hot-tub-cleaning',
    title: 'Hot Tub Cleaning',
    description: 'Prolong your hot tub\'s life by keeping it maintained.',
    iconUrl: 'https://static.thenounproject.com/png/hot-tub-icon-7288886-512.png',
  },
  {
    id: 'heater-repair',
    title: 'Heater Repair',
    description: 'We troubleshoot and fix all pool heating problems.',
    iconUrl: 'https://static.thenounproject.com/png/pool-maintenance-icon-4517487-512.png',
  },
  {
    id: 'pump-repair',
    title: 'Pump Repair',
    description: 'A functional pool pump is critical to usability.',
    iconUrl: 'https://static.thenounproject.com/png/water-pump-machine-icon-4517495-512.png',
  },
  {
    id: 'filter-repair',
    title: 'Filter Repair',
    description: 'Clogged filters are costly and ruin pool water quality.',
    iconUrl: 'https://static.thenounproject.com/png/water-filter-icon-4517499-512.png',
  },
  {
    id: 'pool-light-repair',
    title: 'Pool Light Repair',
    description: 'We quickly replace lights, repair lighting, and more.',
    iconUrl: 'https://static.thenounproject.com/png/light-bulb-icon-8201148-512.png',
  },
  {
    id: 'salt-water-repair',
    title: 'Salt Water System Repair',
    description: 'We have domain specific expertise with salt water.',
    iconUrl: 'https://static.thenounproject.com/png/pool-quality-icon-4517500-512.png',
  },
  {
    id: 'heater-installation',
    title: 'Heater Installation',
    description: 'We recommend & install the right heater for you.',
    iconUrl: 'https://static.thenounproject.com/png/pool-maintenance-icon-4517541-512.png',
  },
  {
    id: 'pump-installation',
    title: 'Pump Installation',
    description: 'We install pool pumps that fit your needs & budget.',
    iconUrl: 'https://static.thenounproject.com/png/water-pump-machine-icon-4517495-512.png',
  },
  {
    id: 'filter-installation',
    title: 'Filter Installation',
    description: 'We ensure your new pool filter is installed correctly.',
    iconUrl: 'https://static.thenounproject.com/png/filtration-icon-4517494-512.png',
  },
  {
    id: 'pool-light-replacement',
    title: 'Pool Light Replacement',
    description: 'Say goodbye to difficult, potentially dangerous swimming pool light replacement.',
    iconUrl: 'https://static.thenounproject.com/png/light-bulb-icon-8201148-512.png',
  },
  {
    id: 'pool-acid-washing',
    title: 'Pool Acid Washing',
    description: 'If your pool\'s showing signs of age, a pool acid washing can give it the refresh it needs.',
    iconUrl: 'https://static.thenounproject.com/png/cleaning-pool-icon-4517493-512.png',
  },
  {
    id: 'drain-restart',
    title: 'Drain & Restart',
    description: 'Drain and replace unbalanced pool water.',
    iconUrl: 'https://static.thenounproject.com/png/drain-water-icon-4517546-512.png',
  },
];

export default function ServicesOverview() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Pool Care Services</h1>
        <p className={styles.heroDescription}>
          Our experienced technicians provide comprehensive pool services to keep your pool looking great & running efficiently.
        </p>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceIconWrapper}>
                <Image
                  src={service.iconUrl}
                  alt={service.title}
                  width={48}
                  height={48}
                  className={styles.serviceIcon}
                  unoptimized
                />
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
