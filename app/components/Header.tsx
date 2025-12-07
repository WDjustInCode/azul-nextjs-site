'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
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
            (888) 768-7554
          </a>
          <Link href="/quote" className={styles.ctaButton} onClick={closeMenu}>
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}

