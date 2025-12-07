"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICE_CITIES } from "../../utils/serviceArea";
import styles from "./StepManualAddress.module.css";
import { BackButton } from "./BackButton";

interface Props {
  onSubmit: (address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  }) => void;
  onBack: (() => void) | null;
}

export function StepManualAddress({
  onSubmit,
  onBack,
}: Props) {
  const router = useRouter();
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !state.trim() || !zip.trim()) return;

    const trimmedCity = city.trim();
    const trimmedStreet = street.trim();
    const trimmedState = state.trim();
    const trimmedZip = zip.trim();

    // Check if city is in service area (case-insensitive)
    const isInServiceArea = SERVICE_CITIES.some(
      (serviceCity) => serviceCity.toLowerCase() === trimmedCity.toLowerCase()
    );

    if (!isInServiceArea) {
      // Format address for the out-of-service page
      const formattedAddress = `${trimmedStreet}, ${trimmedCity}, ${trimmedState} ${trimmedZip}`;
      router.push(`/out-of-service-area?address=${encodeURIComponent(formattedAddress)}`);
      return;
    }

    // If in service area, proceed normally
    onSubmit({
      street: trimmedStreet,
      city: trimmedCity,
      state: trimmedState,
      zip: trimmedZip,
    });
  };

  return (
    <section className={styles.section}>
      {onBack && <BackButton onClick={onBack} />}
      <h1 className={styles.heading}>
        Enter your address manually
      </h1>
      <p className={styles.subtitle}>
        Please provide your complete address to continue.
      </p>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.fieldGroup}>
          <label htmlFor="street" className={styles.label}>
            Street Address
          </label>
          <input
            type="text"
            id="street"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="123 Main Street"
            className={styles.input}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="city" className={styles.label}>
            City
          </label>
          <input
            type="text"
            id="city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className={styles.input}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.fieldGroup}>
            <label htmlFor="state" className={styles.label}>
              State
            </label>
            <input
              type="text"
              id="state"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="CA"
              className={styles.input}
              maxLength={2}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="zip" className={styles.label}>
              ZIP Code
            </label>
            <input
              type="text"
              id="zip"
              required
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
              placeholder="12345"
              className={styles.input}
              maxLength={5}
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
        >
          Continue
        </button>
      </form>
    </section>
  );
}

