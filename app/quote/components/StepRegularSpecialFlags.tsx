"use client";

import { useState } from "react";
import styles from "./StepRegularSpecialFlags.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onNext: (flags: {
    aboveGroundPool: boolean;
    saltwaterPool: boolean;
    treesOverPool: boolean;
  }) => void;
  onBack: (() => void) | null;
}

export function StepRegularSpecialFlags({ onNext, onBack }: Props) {
  const [aboveGroundPool, setAboveGroundPool] = useState(false);
  const [saltwaterPool, setSaltwaterPool] = useState(false);
  const [treesOverPool, setTreesOverPool] = useState(false);

  const handleNext = () => {
    onNext({ aboveGroundPool, saltwaterPool, treesOverPool });
  };

  const hasAnyFlag = aboveGroundPool || saltwaterPool || treesOverPool;

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        Do any of these apply to your pool?
      </h1>
      <p className={styles.subtitle}>
        {hasAnyFlag 
          ? "Click continue when you're done selecting."
          : "If not, just click \"None of these apply.\""}
      </p>

      <div className={styles.options}>
        <ToggleCard
          label="I have an above-ground pool"
          active={aboveGroundPool}
          onToggle={() => setAboveGroundPool((v) => !v)}
        />
        <ToggleCard
          label="I have a saltwater pool"
          active={saltwaterPool}
          onToggle={() => setSaltwaterPool((v) => !v)}
        />
        <ToggleCard
          label="I have trees over the pool"
          active={treesOverPool}
          onToggle={() => setTreesOverPool((v) => !v)}
        />
      </div>

      <div className={styles.nextButton}>
        <button
          type="button"
          onClick={handleNext}
          className={styles.buttonPrimary}
        >
          {hasAnyFlag ? "Continue" : "None of these apply"}
        </button>
      </div>
    </section>
  );
}

function ToggleCard({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${styles.button} ${active ? styles.buttonActive : ''}`}
    >
      <div className={styles.label}>{label}</div>
      <div className={`${styles.checkbox} ${active ? styles.checkboxActive : ''}`}>
        {active && (
          <svg className={styles.checkboxIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
}

