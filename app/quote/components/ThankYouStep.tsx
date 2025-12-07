"use client";

import styles from "./ThankYouStep.module.css";

interface Props {
  address?: string;
}

export function ThankYouStep({ address }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.imagePlaceholder} />

        <div className={styles.content}>
          <h1 className={styles.heading}>
            Thank you!
          </h1>
          <p className={styles.message}>
            We've received your quote request and will be in touch soon with a
            personalized estimate for your service (typically within a couple of
            hours).
          </p>
          {address && (
            <p className={styles.address}>
              Address on file: <span className={styles.addressLabel}>{address}</span>
            </p>
          )}
          <button
            onClick={() => (window.location.href = "/")}
            className={styles.button}
          >
            Back to home
          </button>
        </div>
      </div>
    </section>
  );
}

