'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './AltHeroHeader.module.css';

export default function AltHeroHeader() {
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
          {/* <a href="tel:12104144771" className={styles.phone} onClick={closeMenu}>
            (210) 414-4771
          </a> */}
          <Link href="/contact" className={styles.getInTouchButton} onClick={closeMenu}>
            Get In Touch
          </Link>
        </nav>
      </div>
    </header>
  );
}

