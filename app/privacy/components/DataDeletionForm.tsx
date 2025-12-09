'use client';

import { useState } from 'react';

type Step = 'request' | 'verify';

export default function DataDeletionForm() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('request');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setDevCode(null);

    try {
      const response = await fetch('/api/quotes/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'request-code',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('verify');
        setMessage({ type: 'success', text: data.message || 'Verification code sent to your email!' });
        // In development, show the code
        if (data.verificationCode) {
          setDevCode(data.verificationCode);
        }
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send verification code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!confirm('Are you sure you want to permanently delete all your data? This action cannot be undone.')) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/quotes/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'verify-code',
          code,
          confirm: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: `Success! ${data.deletedCount || 0} record(s) deleted. A confirmation email has been sent to ${email}.`,
        });
        setEmail('');
        setCode('');
        setStep('request');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete data' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      marginTop: '2rem',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
    }}>
      <h2 style={{ marginTop: 0, color: '#dc3545' }}>Request Data Deletion</h2>
      <p>
        You can request deletion of your personal data. This will permanently remove all quote data associated with your email address.
      </p>

      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          color: message.type === 'success' ? '#155724' : '#721c24',
        }}>
          {message.text}
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleRequestCode}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
                maxWidth: '400px',
              }}
              placeholder="your.email@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Sending...' : 'Request Deletion Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleDelete}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="code" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
                textAlign: 'center',
                fontFamily: 'monospace',
                maxWidth: '200px',
              }}
              placeholder="000000"
            />
            <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.5rem' }}>
              Enter the 6-digit code sent to {email}
            </p>
            {devCode && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}>
                <strong>Development Mode:</strong> Verification code: <code>{devCode}</code>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
                opacity: loading || code.length !== 6 ? 0.6 : 1,
              }}
            >
              {loading ? 'Deleting...' : 'Confirm Deletion'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('request');
                setCode('');
                setMessage(null);
                setDevCode(null);
              }}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#721c24',
          }}>
            <strong>⚠️ Warning:</strong> This action cannot be undone. All your quote data will be permanently deleted.
          </div>
        </form>
      )}
    </div>
  );
}

