'use client';

import { useState } from 'react';
import Link from 'next/link';
import AltHeaderStatic from '@/app/components/AltHeaderStatic';
import styles from './page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AltHeaderStatic />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <div className={styles.header}>
              <h1 className={styles.heading}>Get In Touch</h1>
              <p className={styles.subtitle}>
                Have a question or want to learn more about our pool services? We'd love to hear from you.
              </p>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.formWrapper}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="your.email@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="(210) 123-4567"
                    autoComplete="tel"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>
                    Message <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className={styles.textarea}
                    placeholder="Tell us how we can help you..."
                    rows={6}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className={styles.successMessage}>
                    ✓ Thank you! Your message has been sent. We'll get back to you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    {errorMessage || 'Something went wrong. Please try again.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>

                <p className={styles.securityNote}>
                  🔒 Your information is secure and will only be used to respond to your inquiry.
                </p>
              </form>
            </div>
          </div>

          <div className={styles.contactInfo}>
            <h2 className={styles.contactHeading}>Other Ways to Reach Us</h2>
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <strong>Phone:</strong>
                <a href="tel:1210-414-4771" className={styles.contactLink}>
                  (888) 768-7554
                </a>
              </div>
              <div className={styles.contactItem}>
                <strong>Email:</strong>
                <a href="mailto:hello@azulpoolservices.com" className={styles.contactLink}>
                  hello@azulpoolservices.com
                </a>
              </div>
              {/* <div className={styles.contactItem}>
                <strong>Address:</strong>
                <span>1223 Cleveland Ave. Ste 200-305<br />San Antonio, TX 78203</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

