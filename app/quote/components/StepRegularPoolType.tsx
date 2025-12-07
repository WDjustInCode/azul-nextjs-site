"use client";

import styles from "./StepRegularPoolType.module.css";
import { BackButton } from "./BackButton";

interface Props {
  title?: string;
  subtitle?: string;
  onSelect: (poolType: "pool-only" | "pool-spa" | "hot-tub" | "other") => void;
  onBack: (() => void) | null;
}

export function StepRegularPoolType({
  title = "Tell us about your pool",
  subtitle = "We care for pools of all shapes and sizes.",
  onSelect,
  onBack,
}: Props) {
  const items = [
    { id: "pool-only", label: "Pool only" },
    { id: "pool-spa", label: "Pool + spa" },
    { id: "hot-tub", label: "Hot tub only" },
    { id: "other", label: "Something else" },
  ] as const;

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
            onClick={() => onSelect(item.id)}
            className={styles.button}
          >
            <div className={styles.label}>{item.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

