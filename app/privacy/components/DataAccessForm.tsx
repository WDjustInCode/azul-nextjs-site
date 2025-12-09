'use client';

import { useState } from 'react';

type Step = 'request' | 'verify' | 'view';

export default function DataAccessForm() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('request');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<any[]>([]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setDevCode(null);

    try {
      const response = await fetch('/api/quotes/access', {
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

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/quotes/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          action: 'verify-code',
          code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuotes(data.quotes || []);
        setStep('view');
        setMessage({
          type: 'success',
          text: `Success! Found ${data.count || 0} quote(s) associated with your email.`,
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid verification code' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('request');
    setCode('');
    setEmail('');
    setQuotes([]);
    setMessage(null);
    setDevCode(null);
  };

  return (
    <div style={{
      marginTop: '2rem',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
    }}>
      <h2 style={{ marginTop: 0, color: '#0066cc' }}>Request Access to Your Data</h2>
      <p>
        Under the Texas Data Privacy and Security Act (TDPSA), you have the right to access your personal data. 
        Enter your email address to receive a verification code and view all quote data associated with your account.
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

      {step === 'request' && (
        <form onSubmit={handleRequestCode}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="access-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Email Address
            </label>
            <input
              type="email"
              id="access-email"
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
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Sending...' : 'Request Access Code'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerifyCode}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="access-code" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Verification Code
            </label>
            <input
              type="text"
              id="access-code"
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
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: loading || code.length !== 6 ? 'not-allowed' : 'pointer',
                opacity: loading || code.length !== 6 ? 0.6 : 1,
              }}
            >
              {loading ? 'Verifying...' : 'View My Data'}
            </button>
            <button
              type="button"
              onClick={handleReset}
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
        </form>
      )}

      {step === 'view' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>Your Quote Data</h3>
            <p style={{ color: '#6c757d' }}>
              Found {quotes.length} quote{quotes.length !== 1 ? 's' : ''} associated with {email}
            </p>
          </div>

          {quotes.length === 0 ? (
            <div style={{
              padding: '1rem',
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '4px',
              color: '#004085',
            }}>
              No quote data found for this email address.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quotes.map((quote, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6c757d' }}>
                    Submitted: {quote.uploadedAt ? new Date(quote.uploadedAt).toLocaleString() : 'Unknown'}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {JSON.stringify(quote.data, null, 2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleReset}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Request Another Email
          </button>
        </div>
      )}
    </div>
  );
}

