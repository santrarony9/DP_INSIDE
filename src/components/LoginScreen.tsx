import React, { useState } from 'react';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (pin: string) => Promise<void>;
  loading: boolean;
  authError: string | null;
}

export default function LoginScreen({ onLogin, loading, authError }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setLocalError('Please enter your PIN');
      return;
    }
    setLocalError('');
    await onLogin(pin);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: 'var(--text-main)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-dark)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0,0,0,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, rgba(226, 183, 20, 0.2) 0%, rgba(226, 183, 20, 0.05) 100%)',
            border: '1px solid rgba(226, 183, 20, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: 'var(--accent-gold)'
          }}>
            <Lock size={32} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>DP Inside StudioOS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Enter your PIN to access the workstation</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>
              AUTHENTICATION PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN..."
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              autoFocus
            />
          </div>

          {(localError || authError) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '14px',
              marginBottom: '24px'
            }}>
              <AlertCircle size={16} />
              <span>{localError || authError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(to right, var(--accent-gold), #b8920b)',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? (
              'Authenticating...'
            ) : (
              <>
                <LogIn size={20} />
                Access Workstation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
