import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }) {
  const { colors } = useTheme();

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
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          color: '#ef4444', 
          marginBottom: '16px',
          fontSize: '24px'
        }}>
          Something went wrong
        </h2>
        <p style={{ 
          color: colors.textSecondary, 
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          An unexpected error occurred. Please refresh the page or contact support if the problem persists.
        </p>
        {error && (
          <details style={{
            background: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            <summary style={{ 
              color: colors.textSecondary,
              cursor: 'pointer',
              fontSize: '14px'
            }}>
              Error Details
            </summary>
            <pre style={{
              color: colors.text,
              fontSize: '12px',
              marginTop: '8px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.toString()}
            </pre>
          </details>
        )}
        <button
          onClick={() => window.location.reload()}
          style={{
            background: colors.accent,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;