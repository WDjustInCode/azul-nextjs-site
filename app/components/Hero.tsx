'use client';

import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.headline}>We don’t just maintain pools, we maintain trust</h1>
          <p className={styles.subheadline}>
            Reliable, friendly service that keeps your water clean, clear, and worry-free.
          </p>
          <div className={styles.formContainer}>
            <input
              type="text"
              placeholder="Enter your address"
              className={styles.addressInput}
            />
            <button className={styles.ctaButton}>See My Price</button>
          </div>
          <div className={styles.reviews}>
            <div className={styles.stars}>★★★★★</div>
            <span className={styles.reviewText}>
              Rated 4.9/5 by 2,200+ customer reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

