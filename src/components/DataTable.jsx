import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function DataTable({ columns, data, loading, error }) {
  const { colors, isDarkMode } = useTheme();

  if (loading) {
    return (
      <div style={{
        background: colors.cardBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '24px',
        boxShadow: colors.shadow,
        padding: '32px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header skeleton */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr 1fr 1fr',
            gap: '24px',
            paddingBottom: '20px',
            borderBottom: `1px solid ${colors.cardBorder}`
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                height: '20px',
                background: colors.cardBackgroundHover,
                borderRadius: '10px',
                animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${i * 0.1}s`
              }} />
            ))}
          </div>
          {/* Row skeletons */}
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 1fr 1fr',
              gap: '24px',
              padding: '16px 0'
            }}>
              {[1, 2, 3, 4].map(j => (
                <div key={j} style={{
                  height: '16px',
                  background: colors.cardBackground,
                  borderRadius: '8px',
                  animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite ${(i + j) * 0.1}s`
                }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: colors.cardBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '24px',
        boxShadow: colors.shadow,
        padding: '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 0',
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
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              fontFamily: 'Inter, sans-serif'
            }}>Table Error</p>
            <p style={{
              fontSize: '14px',
              opacity: 0.7,
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>Unable to load data</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div style={{
        background: colors.cardBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: '24px',
        boxShadow: colors.shadow,
        padding: '48px 32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.textSecondary,
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              background: colors.cardBackgroundHover,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg style={{
                width: '32px',
                height: '32px',
                opacity: 0.4,
                color: colors.textMuted
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              fontFamily: 'Montserrat, sans-serif',
              color: colors.text
            }}>No Leads Yet</p>
            <p style={{
              fontSize: '14px',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              maxWidth: '300px',
              lineHeight: '1.5',
              color: colors.textSecondary
            }}>
              No contacts have shared their information yet. Try adjusting your date range or check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: colors.cardBackground,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: `1px solid ${colors.cardBorder}`,
      borderRadius: '24px',
      boxShadow: colors.shadow,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = colors.shadowHover;
      e.currentTarget.style.borderColor = colors.cardBorderHover;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = colors.shadow;
      e.currentTarget.style.borderColor = colors.cardBorder;
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

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{
              borderBottom: `1px solid ${colors.cardBorder}`,
              background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
            }}>
              {columns.map(col => (
                <th 
                  key={col.key}
                  style={{
                    padding: '20px 24px',
                    textAlign: 'left',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: colors.textSecondary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontFamily: 'Inter, sans-serif',
                    background: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: '15px' }}>
            {data.map((row, i) => (
              <tr
                key={i}
                style={{
                  background: isDarkMode 
                    ? (i % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)')
                    : (i % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.04)'),
                  borderBottom: i === data.length - 1 ? 'none' : `1px solid ${colors.cardBorder}`,
                  transition: 'all 0.2s ease'
                }}
                tabIndex={0}
                aria-label={columns.map(c => `${c.header}: ${c.render ? c.render(row) : row[c.key]}`).join(', ')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? 'rgba(168, 85, 247, 0.1)' 
                    : 'rgba(168, 85, 247, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode 
                    ? (i % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)')
                    : (i % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'rgba(0, 0, 0, 0.04)');
                }}
              >
                {columns.map(col => (
                  <td 
                    key={col.key}
                    style={{
                      padding: '20px 24px',
                      color: colors.text,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '500',
                      verticalAlign: 'middle'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {col.key === '_i' && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          background: isDarkMode 
                            ? 'rgba(168, 85, 247, 0.2)' 
                            : 'rgba(168, 85, 247, 0.15)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#A855F7'
                        }}>
                          {row[col.key]}
                        </div>
                      )}
                      {col.key !== '_i' && (
                        <span style={{
                          color: col.key === 'name' ? colors.text : colors.textSecondary,
                          fontWeight: col.key === 'name' ? '600' : '500'
                        }}>
                          {col.render ? col.render(row) : row[col.key] || '—'}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        background: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
        borderTop: `1px solid ${colors.cardBorder}`
      }}>
        <p style={{
          fontSize: '14px',
          color: colors.textSecondary,
          margin: 0,
          fontFamily: 'Inter, sans-serif'
        }}>
          Showing <span style={{ 
            fontWeight: '600', 
            color: colors.text 
          }}>{data.length}</span> {data.length === 1 ? 'lead' : 'leads'}
        </p>
      </div>
    </div>
  );
}