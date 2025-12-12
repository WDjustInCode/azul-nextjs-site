'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './AltHeader.module.css';

export default function AltHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show header only after scrolling past 400px
      const scrollThreshold = 600;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.header} ${isVisible ? styles.headerVisible : ''}`}>
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
          <Link href="#services" className={styles.navLink} onClick={closeMenu}>
            Pool Services <span className={styles.dropdown}>▼</span>
          </Link>
          <Link href="#commercial" className={styles.navLink} onClick={closeMenu}>
            Commercial
          </Link>
          <a href="tel:18887687554" className={styles.phone} onClick={closeMenu}>
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

