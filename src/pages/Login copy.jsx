// src/pages/Login.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Attempt sign-in with email & password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If no user exists, sign them up then retry
        if (error.message.includes('Invalid login credentials')) {
          const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
          });
          if (signupError) {
            setErrorMsg(signupError.message);
            setLoading(false);
            return;
          }

          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (retryError) {
            setErrorMsg(retryError.message);
            setLoading(false);
            return;
          }
        } else {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      // On success, navigate to dashboard
      navigate('/');
    } catch (err) {
      setErrorMsg('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '400px',
        height: '400px',
        background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      {/* Floating particles */}
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '30%',
        width: '6px',
        height: '6px',
        background: colors.accent,
        borderRadius: '50%',
        animation: 'twinkle 3s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '40%',
        left: '20%',
        width: '4px',
        height: '4px',
        background: colors.accent,
        borderRadius: '50%',
        animation: 'twinkle 4s ease-in-out infinite 1s'
      }}></div>

      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          padding: '12px',
          background: colors.cardBackground,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '12px',
          color: colors.text,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colors.cardBackgroundHover;
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.borderColor = colors.cardBorderHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = colors.cardBackground;
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = colors.cardBorder;
        }}
        title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
      >
        <span>{isDarkMode ? '☀️' : '🌙'}</span>
      </button>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '450px',
        margin: '0 24px'
      }}>
        {/* Login Card */}
        <div style={{
          background: colors.cardBackground,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${colors.cardBorder}`,
          borderRadius: '32px',
          padding: '48px',
          boxShadow: colors.shadow,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: colors.accent,
            opacity: 0.8
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: colors.accent,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px',
              boxShadow: '0 8px 32px rgba(168, 85, 247, 0.3)',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              🚀
            </div>
            
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'transparent',
              background: colors.accent,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              marginBottom: '12px',
              fontFamily: 'Montserrat, sans-serif'
            }}>
              Welcome to Yuno
            </h1>
            
            <p style={{
              color: colors.textSecondary,
              fontSize: '16px',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              Sign in to access your AI analytics dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Email Input */}
            <div>
              <label style={{
                display: 'block',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: colors.cardBackground,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '16px',
                  color: colors.text,
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#A855F7';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.cardBorder;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{
                display: 'block',
                color: colors.text,
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                fontFamily: 'Inter, sans-serif'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: colors.cardBackground,
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '16px',
                  color: colors.text,
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#A855F7';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.cardBorder;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '18px',
                background: loading ? 'rgba(168, 85, 247, 0.5)' : colors.accent,
                border: 'none',
                borderRadius: '16px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '700',
                fontFamily: 'Inter, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(168, 85, 247, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(168, 85, 247, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(168, 85, 247, 0.3)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid #FFFFFF',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Signing In...
                </div>
              ) : (
                'Continue to Dashboard'
              )}
            </button>

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                color: '#EF4444',
                fontSize: '14px',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}>
                {errorMsg}
              </div>
            )}
          </form>

          {/* Footer */}
          <div style={{
            marginTop: '32px',
            padding: '24px 0',
            borderTop: `1px solid ${colors.cardBorder}`,
            textAlign: 'center'
          }}>
            <p style={{
              color: colors.textMuted,
              fontSize: '13px',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              New user? Just enter your email and password to create an account automatically.
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px'
        }}>
          <p style={{
            color: colors.textMuted,
            fontSize: '14px',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            Powered by Yuno AI • Built with ❤️ for better conversations
          </p>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>
    </div>
  );
}