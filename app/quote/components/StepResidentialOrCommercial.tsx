"use client";

import styles from "./StepResidentialOrCommercial.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onSelect: (segment: "residential" | "commercial") => void;
  onBack: (() => void) | null;
}

export function StepResidentialOrCommercial({ onSelect, onBack }: Props) {
  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        Is this a residential or commercial pool?
      </h1>
      <p className={styles.subtitle}>
        We'll tailor your quote based on your pool type.
      </p>

      <div className={styles.options}>
        <button
          type="button"
          onClick={() => onSelect("residential")}
          className={styles.button}
        >
          <div className={styles.label}>
            Residential
          </div>
          <p className={styles.description}>
            Backyard pools and spas at single-family homes.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelect("commercial")}
          className={styles.button}
        >
          <div className={styles.label}>
            Commercial
          </div>
          <p className={styles.description}>
            Apartments, hotels, HOAs, gyms, and more.
          </p>
        </button>
      </div>
    </section>
  );
}

