"use client";

import { StepEmailCapture } from "./StepEmailCapture";
import styles from "./StepAboveGroundNotice.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onEmailSubmit: (email: string) => void;
  onBack: (() => void) | null;
  initialEmail?: string;
}

export function StepAboveGroundNotice({ onEmailSubmit, onBack, initialEmail }: Props) {
  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        We don't clean above-ground pools
      </h1>
      <p className={styles.subtitle}>
        However, we'd be happy to provide a regular chemical service to keep your
        water clear year-round.
      </p>

      <StepEmailCapture
        title="Where can we send your quote?"
        subtitle=""
        cta="Get My Chemical Service Quote"
        initialEmail={initialEmail}
        onSubmit={onEmailSubmit}
        onBack={null}
      />
    </section>
  );
}

