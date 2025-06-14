import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ChartCard({ title, subtitle, loading, error, children, className = '' }) {
  const { colors } = useTheme();
  
  return (
    <div
      style={{
        position: 'relative',
        padding: '28px',
        height: '100%',
        minHeight: '320px',
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
        flexDirection: 'column'
      }}
      className={`group ${className}`}
      tabIndex={0}
      aria-label={`${title}: ${loading ? 'Loading' : error ? 'Error' : 'Chart'}`}
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
      <div style={{ marginBottom: '24px', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: colors.text,
            margin: 0,
            fontFamily: 'Montserrat, sans-serif',
            lineHeight: '1.3',
            letterSpacing: '-0.02em'
          }}>
            {title}
          </h3>
          <div style={{
            width: '8px',
            height: '8px',
            background: colors.accent,
            borderRadius: '50%',
            opacity: 0.7,
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)'
          }} />
        </div>
        
        {subtitle && (
          <p style={{
            fontSize: '13px',
            color: colors.textSecondary,
            margin: 0,
            lineHeight: '1.4',
            fontFamily: 'Inter, sans-serif'
          }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px',
            height: '100%',
            minHeight: '240px'
          }}>
            <div style={{
              height: '200px',
              background: colors.cardBackgroundHover,
              borderRadius: '16px',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Shimmer effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${colors.cardBackgroundHover}, transparent)`,
                animation: 'shimmer 2s infinite'
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px'
            }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  height: '12px',
                  width: '50px',
                  background: colors.cardBackground,
                  borderRadius: '6px',
                  animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.2}s`
                }} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '300px',
            color: '#F87171'
          }}>
            <div style={{ textAlign: 'center' }}>
              <svg style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 16px',
                opacity: 0.6
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                fontFamily: 'Inter, sans-serif'
              }}>Chart Unavailable</p>
              <p style={{
                fontSize: '13px',
                opacity: 0.7,
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>Unable to load data</p>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', minHeight: '240px' }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}