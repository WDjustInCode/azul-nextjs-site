"use client";

import { useEffect, useState } from "react";
import styles from "./StepContactInfo.module.css";
import { BackButton } from "./BackButton";

interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Props {
  onSubmit: (info: ContactInfo) => void;
  onBack: (() => void) | null;
  initialValues?: Partial<ContactInfo>;
}

export function StepContactInfo({
  onSubmit,
  onBack,
  initialValues,
}: Props) {
  const [firstName, setFirstName] = useState(initialValues?.firstName ?? "");
  const [lastName, setLastName] = useState(initialValues?.lastName ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");

  // Keep fields in sync when user navigates back
  useEffect(() => {
    setFirstName(initialValues?.firstName ?? "");
    setLastName(initialValues?.lastName ?? "");
    setEmail(initialValues?.email ?? "");
    setPhone(initialValues?.phone ?? "");
  }, [initialValues?.firstName, initialValues?.lastName, initialValues?.email, initialValues?.phone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) return;
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        Who should we send your quote to?
      </h1>
      <p className={styles.subtitle}>
        We'll also text you updates—no spam, ever.
      </p>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.row}>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className={styles.input}
            autoComplete="given-name"
          />
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className={styles.input}
            autoComplete="family-name"
          />
        </div>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.input}
          autoComplete="email"
        />

        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className={styles.input}
          autoComplete="tel"
        />

        <p className={styles.securityNote}>
          🔒 Your information is fully secure.
        </p>
        <button
          type="submit"
          className={styles.submitButton}
        >
          Next
        </button>
      </form>
    </section>
  );
}


