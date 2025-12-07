"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

function OutOfServiceAreaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    // TODO: Replace with actual API call to submit the form
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Out of service area submission:", {
        email: email.trim(),
        message: message.trim(),
        address: address || "Not provided",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.icon}>✓</div>
          <h1 className={styles.heading}>Thank You!</h1>
          <p className={styles.message}>
            We've received your message and will get back to you soon. 
            We appreciate your interest in our services!
          </p>
          <button
            onClick={() => router.push("/")}
            className={styles.button}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>📍</div>
        <h1 className={styles.heading}>We're Not in Your Area Yet</h1>
        <p className={styles.message}>
          Unfortunately, we don't currently provide service in your area. 
          We're sorry we can't help you right now.
        </p>
        
        {address && (
          <div className={styles.addressNote}>
            <strong>Your address:</strong> {address}
          </div>
        )}

        <p className={styles.helpText}>
          However, we'd love to hear from you! Leave us your email and a message 
          about what you need, and perhaps we can help somehow or let you know 
          when we expand to your area.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="message" className={styles.label}>
              How Can We Help?
            </label>
            <textarea
              id="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your pool service needs..."
              className={styles.textarea}
              rows={5}
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        <button
          onClick={() => router.push("/")}
          className={styles.backButton}
          type="button"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default function OutOfServiceAreaPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.icon}>📍</div>
          <h1 className={styles.heading}>Loading...</h1>
        </div>
      </div>
    }>
      <OutOfServiceAreaContent />
    </Suspense>
  );
}

