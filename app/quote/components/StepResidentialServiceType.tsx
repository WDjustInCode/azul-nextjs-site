"use client";

import { useState } from "react";
import { ServiceCategory } from "./types";
import styles from "./StepResidentialServiceType.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onSelect: (category: ServiceCategory, otherText?: string) => void;
  onBack: (() => void) | null;
}

export function StepResidentialServiceType({ onSelect, onBack }: Props) {
  const [selectedOther, setSelectedOther] = useState(false);
  const [otherText, setOtherText] = useState("");

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

  const handleSelect = (id: ServiceCategory) => {
    if (id === "other") {
      setSelectedOther(true);
    } else {
      setSelectedOther(false);
      onSelect(id);
    }
  };

  const handleOtherSubmit = () => {
    if (otherText.trim()) {
      onSelect("other", otherText.trim());
    }
  };

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
            onClick={() => handleSelect(opt.id)}
            className={`${styles.button} ${selectedOther && opt.id === "other" ? styles.buttonActive : ""}`}
          >
            <span className={styles.label}>{opt.label}</span>
            <span className={styles.description}>{opt.sub}</span>
          </button>
        ))}
      </div>

      {selectedOther && (
        <div className={styles.otherInputContainer}>
          <input
            type="text"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Please describe what you need help with"
            className={styles.otherInput}
            autoFocus
          />
          <button
            type="button"
            onClick={handleOtherSubmit}
            disabled={!otherText.trim()}
            className={styles.otherSubmitButton}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

