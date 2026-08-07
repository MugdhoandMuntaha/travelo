'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
import { AdminPanel } from '@/src/components/AdminPanel';

export default function AdminPage() {
  const router = useRouter();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingCheck, setIsLoadingCheck] = useState<boolean>(true);

  // Form State
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // Check if session token exists in sessionStorage
    const token = sessionStorage.getItem('travelo_admin_token');
    if (token && token.startsWith('travelo_session_')) {
      setIsAuthenticated(true);
    }
    setIsLoadingCheck(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem('travelo_admin_token', data.token);
        setIsAuthenticated(true);
      } else {
        setErrorMsg(data.error || 'Invalid username or password.');
      }
    } catch (err: any) {
      setErrorMsg('Server connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('travelo_admin_token');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (isLoadingCheck) {
    return (
      <div style={{ minHeight: '100vh', background: '#060F22', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93A5C4' }}>
        <Loader2 size={32} className="animate-spin" color="#5B93FF" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AdminPanel 
        onBackToSite={() => {
          router.push('/');
        }} 
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #0E2248 0%, #060F22 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(11, 27, 58, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        
        {/* Logo / Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #2E6FF2 0%, #1b53c7 100%)', marginBottom: '1.25rem', boxShadow: '0 8px 25px rgba(46, 111, 242, 0.4)' }}>
          <ShieldCheck size={34} color="#ffffff" />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Admin Authentication
        </h1>
        
        <p style={{ fontSize: '0.875rem', color: '#93A5C4', marginBottom: '2rem', lineHeight: 1.5 }}>
          Enter your administrative username &amp; password to access the Travelo Control Center.
        </p>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            padding: '0.85rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <KeyRound size={16} color="#ef4444" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          
          {/* Username Field */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '0.5rem' }}>
              Admin Username
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} color="#93A5C4" style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }} />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#060F22',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', display: 'block', marginBottom: '0.5rem' }}>
              Admin Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="#93A5C4" style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '0.85rem 2.75rem 0.85rem 2.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: '#060F22',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: '#93A5C4',
                  cursor: 'pointer',
                  padding: 0
                }}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.9rem 1.5rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #2E6FF2 0%, #1b53c7 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 25px rgba(46, 111, 242, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              transition: 'transform 0.15s ease, opacity 0.15s ease',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Verifying Credentials...
              </>
            ) : (
              'Sign In to Admin Portal'
            )}
          </button>
        </form>

        {/* Back to Website */}
        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#93A5C4',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'color 0.2s ease'
            }}
          >
            <ArrowLeft size={16} /> Return to Main Website
          </button>
        </div>

      </div>
    </div>
  );
}
