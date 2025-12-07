"use client";

import { useState } from "react";
import styles from "./StepRegularPoolType.module.css";
import { BackButton } from "./BackButton";

interface Props {
  title?: string;
  subtitle?: string;
  onSelect: (poolType: "pool-only" | "pool-spa" | "hot-tub" | "other", otherText?: string) => void;
  onBack: (() => void) | null;
}

export function StepRegularPoolType({
  title = "Tell us about your pool",
  subtitle = "We care for pools of all shapes and sizes.",
  onSelect,
  onBack,
}: Props) {
  const [selectedOther, setSelectedOther] = useState(false);
  const [otherText, setOtherText] = useState("");

  const items = [
    { id: "pool-only", label: "Pool only" },
    { id: "pool-spa", label: "Pool + spa" },
    { id: "hot-tub", label: "Hot tub only" },
    { id: "other", label: "Something else" },
  ] as const;

  const handleSelect = (id: typeof items[number]["id"]) => {
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
        {title}
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.options}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            className={`${styles.button} ${selectedOther && item.id === "other" ? styles.buttonActive : ""}`}
          >
            <div className={styles.label}>{item.label}</div>
          </button>
        ))}
      </div>

      {selectedOther && (
        <div className={styles.otherInputContainer}>
          <input
            type="text"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Please describe your pool type"
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

