'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './AltHeader.module.css';

interface Service {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  href?: string;
}

const maintenanceServices: Service[] = [
  {
    id: 'pool-cleaning',
    title: 'Pool Cleaning',
    description: 'We clean your pool to the highest industry standards.',
    iconUrl: 'https://static.thenounproject.com/png/clean-pool-icon-4517497-512.png',
    href: '/services#pool-cleaning',
  },
  {
    id: 'filter-cleaning',
    title: 'Filter Cleaning',
    description: 'We make sure your filter keeps your pool water safe.',
    iconUrl: 'https://static.thenounproject.com/png/pool-filter-icon-4517488-512.png',
    href: '/services#filter-cleaning',
  },
  {
    id: 'drain-restart',
    title: 'Drain & Restart',
    description: 'Drain and replace unbalanced pool water.',
    iconUrl: 'https://static.thenounproject.com/png/drain-water-icon-4517546-512.png',
    href: '/services#drain-restart',
  },
  {
    id: 'algae-removal',
    title: 'Algae Removal',
    description: 'Prevent, control and remove any algae & mold.',
    iconUrl: 'https://static.thenounproject.com/png/algae-icon-7789070-512.png',
    href: '/services#algae-removal',
  },
  {
    id: 'pool-acid-washing',
    title: 'Pool Acid Washing',
    description: 'Give your pool the refresh it needs.',
    iconUrl: 'https://static.thenounproject.com/png/cleaning-pool-icon-4517493-512.png',
    href: '/services#pool-acid-washing',
  },
  {
    id: 'hot-tub-cleaning',
    title: 'Hot Tub Cleaning',
    description: 'Prolong your hot tub\'s life by keeping it maintained.',
    iconUrl: 'https://static.thenounproject.com/png/hot-tub-icon-7288886-512.png',
    href: '/services#hot-tub-cleaning',
  },
];

const repairServices: Service[] = [
  {
    id: 'heater-repair',
    title: 'Heater Repair',
    description: 'We troubleshoot and fix all pool heating problems.',
    iconUrl: 'https://static.thenounproject.com/png/pool-maintenance-icon-4517487-512.png',
    href: '/services#heater-repair',
  },
  {
    id: 'pump-repair',
    title: 'Pump Repair',
    description: 'A functional pool pump is critical to usability.',
    iconUrl: 'https://static.thenounproject.com/png/water-pump-machine-icon-4517495-512.png',
    href: '/services#pump-repair',
  },
  {
    id: 'filter-repair',
    title: 'Filter Repair',
    description: 'Clogged filters are costly and ruin pool water quality.',
    iconUrl: 'https://static.thenounproject.com/png/water-filter-icon-4517499-512.png',
    href: '/services#filter-repair',
  },
  {
    id: 'pool-light-repair',
    title: 'Pool Light Repair',
    description: 'We quickly replace lights, repair lighting, and more.',
    iconUrl: 'https://static.thenounproject.com/png/light-bulb-icon-8201148-512.png',
    href: '/services#pool-light-repair',
  },
  {
    id: 'salt-water-repair',
    title: 'Salt Water System Repair',
    description: 'We have domain specific expertise with salt water.',
    iconUrl: 'https://static.thenounproject.com/png/pool-quality-icon-4517500-512.png',
    href: '/services#salt-water-repair',
  },
  {
    id: 'pool-light-replacement',
    title: 'Light Replacement',
    description: 'Say goodbye to difficult, potentially dangerous swimming pool light replacement.',
    iconUrl: 'https://static.thenounproject.com/png/light-bulb-icon-8201148-512.png',
    href: '/services#pool-light-replacement',
  },
];

const installationServices: Service[] = [
  {
    id: 'heater-installation',
    title: 'Heater Installation',
    description: 'We recommend & install the right heater for you.',
    iconUrl: 'https://static.thenounproject.com/png/pool-maintenance-icon-4517541-512.png',
    href: '/services#heater-installation',
  },
  {
    id: 'pump-installation',
    title: 'Pump Installation',
    description: 'We install pool pumps that fit your needs & budget.',
    iconUrl: 'https://static.thenounproject.com/png/water-pump-machine-icon-4517495-512.png',
    href: '/services#pump-installation',
  },
  {
    id: 'filter-installation',
    title: 'Filter Installation',
    description: 'We ensure your new pool filter is installed correctly.',
    iconUrl: 'https://static.thenounproject.com/png/filtration-icon-4517494-512.png',
    href: '/services#filter-installation',
  },
];

export default function AltHeaderStatic() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${styles.headerVisible}`}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          <img
            src="/logo_mark_dark.svg"
            alt="azul"
            width={120}
            height={43}
            className={styles.logoImage}
          />
        </Link>
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
        {isMenuOpen && (
          <div className={styles.backdrop} onClick={closeMenu}></div>
        )}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <div
            className={styles.dropdownContainer}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link href="/services" className={styles.navLink} onClick={closeMenu}>
              Pool Services <span className={styles.dropdownArrow}>{isDropdownOpen ? '▲' : '▼'}</span>
            </Link>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownColumn}>
                    <h3 className={styles.dropdownCategory}>POOL MAINTENANCE</h3>
                    {maintenanceServices.map((service) => (
                      <Link
                        key={service.id}
                        href={service.href || '/services'}
                        className={styles.dropdownItem}
                        onClick={closeMenu}
                      >
                        <div className={styles.dropdownIcon}>
                          <Image
                            src={service.iconUrl}
                            alt={service.title}
                            width={24}
                            height={24}
                            unoptimized
                          />
                        </div>
                        <div className={styles.dropdownText}>
                          <span className={styles.dropdownTitle}>{service.title}</span>
                          <span className={styles.dropdownDescription}>{service.description}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className={styles.dropdownColumn}>
                    <h3 className={styles.dropdownCategory}>POOL REPAIR</h3>
                    {repairServices.map((service) => (
                      <Link
                        key={service.id}
                        href={service.href || '/services'}
                        className={styles.dropdownItem}
                        onClick={closeMenu}
                      >
                        <div className={styles.dropdownIcon}>
                          <Image
                            src={service.iconUrl}
                            alt={service.title}
                            width={24}
                            height={24}
                            unoptimized
                          />
                        </div>
                        <div className={styles.dropdownText}>
                          <span className={styles.dropdownTitle}>{service.title}</span>
                          <span className={styles.dropdownDescription}>{service.description}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className={styles.dropdownColumn}>
                    <h3 className={styles.dropdownCategory}>EQUIPMENT INSTALLATION</h3>
                    {installationServices.map((service) => (
                      <Link
                        key={service.id}
                        href={service.href || '/services'}
                        className={styles.dropdownItem}
                        onClick={closeMenu}
                      >
                        <div className={styles.dropdownIcon}>
                          <Image
                            src={service.iconUrl}
                            alt={service.title}
                            width={24}
                            height={24}
                            unoptimized
                          />
                        </div>
                        <div className={styles.dropdownText}>
                          <span className={styles.dropdownTitle}>{service.title}</span>
                          <span className={styles.dropdownDescription}>{service.description}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/quote?step=commercial-form&from=header" className={styles.navLink} onClick={closeMenu}>
            Commercial
          </Link>
          <a href="tel:1210-414-4771" className={styles.phone} onClick={closeMenu}>
            (888) 000-0000
          </a>
          <Link href="/quote" className={styles.ctaButton} onClick={closeMenu}>
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}

