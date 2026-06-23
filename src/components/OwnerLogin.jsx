import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Mail, RefreshCw, ArrowLeft, Send, Check } from 'lucide-react';

function OwnerLogin({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot Password / OTP States
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'otp', 'reset'
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      if (data.user.role !== 'owner') {
        throw new Error('Unauthorized: This account is not registered as the Business Owner');
      }

      onLoginSuccess(data.token, data.user);
      navigate('/owner-panel');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      
      setMessage(data.message);
      setMode('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!email || !otp) return;

    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP code');
      }
      
      setMessage('OTP verified! Choose a new password below.');
      setMode('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) return;

    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      alert(data.message);
      setMode('login');
      setPassword('');
      setError('');
      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 2rem 4rem 2rem',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
        padding: '2.5rem',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            marginBottom: '1rem'
          }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Owner Portal
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {mode === 'login' && 'Log in using your registered credentials.'}
            {mode === 'forgot' && 'Request a secure password reset link.'}
            {mode === 'otp' && 'Enter the 6-digit OTP code sent to your email.'}
            {mode === 'reset' && 'Specify a new secure password.'}
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#ef4444',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            color: '#16a34a',
            padding: '0.75rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Check size={16} />
            <span>{message}</span>
          </div>
        )}

        {/* 1. Login Mode */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Gmail / Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  className="form-control"
                  placeholder="owner@sebapoint.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Password</label>
                <button 
                  type="button"
                  onClick={() => { setError(''); setMode('forgot'); }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn"
              disabled={loading}
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '1rem',
                marginTop: '0.5rem',
                boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
              }}
            >
              {loading ? <RefreshCw size={18} className="spin-animation" /> : 'Log In'}
            </button>
          </form>
        )}

        {/* 2. Forgot Password - Email input */}
        {mode === 'forgot' && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Registered Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  className="form-control"
                  placeholder="owner@sebapoint.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => { setError(''); setMode('login'); }}
                style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button 
                type="submit" 
                className="btn"
                disabled={loading}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  flex: 2,
                  justifyContent: 'center',
                  padding: '0.75rem'
                }}
              >
                {loading ? <RefreshCw size={16} className="spin-animation" /> : <><Send size={16} /><span>Request OTP</span></>}
              </button>
            </div>
          </form>
        )}

        {/* 3. OTP Verification */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>6-Digit OTP Code</label>
              <input 
                type="text" 
                maxLength="6"
                className="form-control"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em', fontWeight: 700 }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => { setError(''); setMode('forgot'); }}
                style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button 
                type="submit" 
                className="btn"
                disabled={loading}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  flex: 2,
                  justifyContent: 'center',
                  padding: '0.75rem'
                }}
              >
                {loading ? <RefreshCw size={16} className="spin-animation" /> : 'Verify Code'}
              </button>
            </div>
          </form>
        )}

        {/* 4. Reset Password */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="password" 
                  className="form-control"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn"
              disabled={loading}
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                fontSize: '1rem',
                marginTop: '0.5rem'
              }}
            >
              {loading ? <RefreshCw size={18} className="spin-animation" /> : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Bottom Toggle */}
        <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
          <button 
            onClick={() => navigate('/adminlogin')}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Are you an Employee? Log in here
          </button>
        </div>

      </div>
    </div>
  );
}

export default OwnerLogin;
