import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function LoadingSpinner({ size = 40, text = 'Loading...' }) {
  const { colors } = useTheme();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: colors.background
    }}>
      <div
        style={{
          width: size,
          height: size,
          border: `3px solid ${colors.border}`,
          borderTop: `3px solid ${colors.accent}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{
        marginTop: '16px',
        color: colors.textSecondary,
        fontSize: '14px'
      }}>
        {text}
      </p>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}