"use client";

import { PoolSize } from "./types";
import { useState } from "react";
import styles from "./StepPoolSize.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onNext: (size: PoolSize) => void;
  onBack: (() => void) | null;
}

export function StepPoolSize({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<PoolSize | null>(null);

  const handleNext = () => {
    if (!selected) return;
    onNext(selected);
  };

  const items: { id: PoolSize; label: string; desc: string }[] = [
    { id: "small", label: "Small", desc: "roughly 10' x 20'" },
    { id: "medium", label: "Medium", desc: "roughly 15' x 25'" },
    { id: "large", label: "Large", desc: "roughly 20' x 35'" },
  ];

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        How big is your pool?
      </h1>
      <p className={styles.subtitle}>
        Just your best guess is fine.
      </p>

      <div className={styles.options}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelected(item.id)}
            className={`${styles.button} ${selected === item.id ? styles.buttonActive : ''}`}
          >
            <div className={styles.label}>{item.label}</div>
            <div className={styles.description}>{item.desc}</div>
          </button>
        ))}
      </div>

      <div className={styles.nextButton}>
        <button
          type="button"
          disabled={!selected}
          onClick={handleNext}
          className={styles.buttonPrimary}
        >
          Next
        </button>
      </div>
    </section>
  );
}

