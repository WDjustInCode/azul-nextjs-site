"use client";

import { useState, FormEvent } from "react";
import styles from "./CommercialForm.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onSubmit: (data: { email: string; company: string; message: string }) => void;
  onBack: (() => void) | null;
}

export function CommercialForm({ onSubmit, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ email, company, message });
  };

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        It looks like this is a commercial pool.
      </h1>
      <p className={styles.subtitle}>
        Let's schedule a time to come on-site and provide a service estimate.
      </p>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <input
          type="email"
          required
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          required
          placeholder="Your company name"
          className={styles.input}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <textarea
          required
          placeholder="What can we help you with?"
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          type="submit"
          className={styles.submitButton}
        >
          Submit
        </button>
      </form>
    </section>
  );
}
