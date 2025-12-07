"use client";

import { ServiceCategory } from "./types";
import styles from "./StepResidentialServiceType.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onSelect: (category: ServiceCategory) => void;
  onBack: (() => void) | null;
}

export function StepResidentialServiceType({ onSelect, onBack }: Props) {
  const options: { id: ServiceCategory; label: string; sub: string }[] = [
    {
      id: "regular",
      label: "Regular pool or spa service",
      sub: "Weekly or bi-weekly cleaning & chemicals",
    },
    {
      id: "equipment",
      label: "Equipment upgrade or repair",
      sub: "Pumps, filters, heaters, salt systems & more",
    },
    {
      id: "filter",
      label: "Filter or salt cell cleaning",
      sub: "Deep clean for better water quality",
    },
    {
      id: "green",
      label: `"Green to clean" pool rescue`,
      sub: "Heavy cleanup to get you swim-ready again",
    },
    {
      id: "other",
      label: "Something else",
      sub: "Tell us what you need help with",
    },
  ];

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        What can we help you with?
      </h1>
      <p className={styles.subtitle}>
        Cleaning, chemicals, repairs — we do it all.
      </p>

      <div className={styles.options}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={styles.button}
          >
            <span className={styles.label}>{opt.label}</span>
            <span className={styles.description}>{opt.sub}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

