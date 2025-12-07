"use client";

import { useState } from "react";
import styles from "./StepEquipmentOptions.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onNext: (selected: string[]) => void;
  onBack: (() => void) | null;
}

export function StepEquipmentOptions({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const options = [
    "Pool pump",
    "Pool filter",
    "Pool heater",
    "Salt system",
    "Automation system",
    "I'm not sure / something else",
  ];

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        What equipment do you need help with?
      </h1>

      <div className={styles.options}>
        {options.map((label) => {
          const active = selected.includes(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              className={`${styles.button} ${active ? styles.buttonActive : ''}`}
            >
              <span className={styles.label}>{label}</span>
              <div className={`${styles.checkbox} ${active ? styles.checkboxActive : ''}`}>
                {active && (
                  <svg className={styles.checkboxIcon} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className={styles.nextButton}>
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={() => onNext(selected)}
          className={styles.buttonPrimary}
        >
          Next
        </button>
      </div>
    </section>
  );
}

