"use client";

import { useEffect, useState } from "react";
import styles from "./StepEmailCapture.module.css";
import { BackButton } from "./BackButton";

interface Props {
  title?: string;
  subtitle?: string;
  cta?: string;
  onSubmit: (email: string) => void;
  onBack: (() => void) | null;
  initialEmail?: string;
}

export function StepEmailCapture({
  title = "Where can we send your estimate?",
  subtitle = "Your information is secure and only used for your quote.",
  cta = "Next",
  onSubmit,
  onBack,
  initialEmail = "",
}: Props) {
  const [email, setEmail] = useState(initialEmail);

  // Keep field in sync if user navigates back
  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email.trim());
  };

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        {title}
      </h1>
      <p className={styles.subtitle}>{subtitle}</p>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.input}
        />
        <p className={styles.securityNote}>
          🔒 Your information is fully secure.
        </p>
        <button
          type="submit"
          className={styles.submitButton}
        >
          {cta}
        </button>
      </form>
    </section>
  );
}

