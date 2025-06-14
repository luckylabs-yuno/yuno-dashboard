import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function KpiCard({ title, subtitle, value, loading, error, className = '' }) {
  const { colors } = useTheme();
  
  return (
    <div
      style={{
        position: 'relative',
        padding: '32px',
        height: '100%',
        minHeight: '180px',
        background: colors.cardBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '24px',
        boxShadow: colors.shadow,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      className={`group ${className}`}
      tabIndex={0}
      aria-label={`${title}: ${loading ? 'Loading' : error ? 'Error' : value}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.cardBackgroundHover;
        e.currentTarget.style.borderColor = colors.cardBorderHover;
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = colors.shadowHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.cardBackground;
        e.currentTarget.style.borderColor = colors.cardBorder;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = colors.shadow;
      }}
    >
      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: colors.accent,
        opacity: 0.6
      }} />
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: colors.text,
            margin: 0,
            fontFamily: 'Montserrat, sans-serif',
            lineHeight: '1.3',
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h2>
          <div style={{
            width: '8px',
            height: '8px',
            background: colors.accent,
            borderRadius: '50%',
            opacity: 0.7,
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)'
          }} />
        </div>
        
        {subtitle && (
          <p style={{
            fontSize: '14px',
            color: colors.textSecondary,
            margin: 0,
            lineHeight: '1.4',
            fontFamily: 'Inter, sans-serif'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Value */}
      <div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              height: '40px',
              width: '120px',
              background: colors.cardBackgroundHover,
              borderRadius: '12px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
            <div style={{
              height: '16px',
              width: '80px',
              background: colors.cardBackground,
              borderRadius: '8px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
          </div>
        ) : error ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#F87171',
              fontFamily: 'Montserrat, sans-serif'
            }}>—</span>
            <span style={{
              fontSize: '14px',
              color: 'rgba(248, 113, 113, 0.8)',
              fontFamily: 'Inter, sans-serif'
            }}>Error</span>
          </div>
        ) : (
          <div style={{
            fontSize: '42px',
            fontWeight: '800',
            color: colors.text,
            fontFamily: 'Montserrat, sans-serif',
            lineHeight: '1',
            letterSpacing: '-0.02em',
            textShadow: colors.isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {value}
          </div>
        )}
      </div>
    </div>
  );
}