import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Login() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Access token is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid access token');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Authenticating..." />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: colors.background,
      padding: '20px'
    }}>
      <div style={{
        background: colors.cardBackground,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            background: colors.accent,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            margin: 0
          }}>
            Yuno
          </h1>
          <p style={{
            color: colors.textSecondary,
            fontSize: '16px',
            marginTop: '8px'
          }}>
            Dashboard Access
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: colors.text,
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Access Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your access token from onboarding"
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                background: colors.background,
                color: colors.text,
                fontSize: '14px'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px'
            }}>
              <p style={{
                color: '#dc2626',
                fontSize: '14px',
                margin: 0
              }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: colors.accent,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        {/* Help Text */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            color: colors.textSecondary,
            fontSize: '14px',
            lineHeight: '1.4'
          }}>
            Don't have an access token?{' '}
            
            <a href="https://onboarding.helloyuno.com"
              style={{
                color: colors.accent,
                textDecoration: 'none'
              }}
            >
              Complete onboarding
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}