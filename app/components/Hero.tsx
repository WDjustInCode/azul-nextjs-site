'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const router = useRouter();
  const [address, setAddress] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    router.push(`/quote?address=${encodeURIComponent(address.trim())}`);
  };

  const handleSkipAddress = () => {
    router.push('/quote');
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className={styles.headline}>We don't just maintain pools, we maintain trust</h1>
          <p className={styles.subheadline}>
            Reliable, friendly service that keeps your water clean, clear, and worry-free.
          </p>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <input
              type="text"
              placeholder="Enter your address"
              className={styles.addressInput}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button type="submit" className={styles.ctaButton}>See My Price</button>
          </form>
          <button
            onClick={handleSkipAddress}
            className={styles.skipLink}
            type="button"
          >
            Can't find my address
          </button>
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

