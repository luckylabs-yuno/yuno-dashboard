import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function DateRangePicker({ rangeOptions, selected, onChange }) {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '8px',
      background: colors.cardBackground,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: `1px solid ${colors.cardBorder}`,
      boxShadow: colors.shadow
    }}>
      {rangeOptions.map(opt => (
        <button
          key={opt.value}
          type="button"
          style={{
            padding: '12px 20px',
            fontWeight: '600',
            fontSize: '14px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            position: 'relative',
            overflow: 'hidden',
            ...(selected === opt.value ? {
              background: colors.accent,
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.4)',
              transform: 'translateY(-1px)',
              border: '1px solid rgba(168, 85, 247, 0.3)'
            } : {
              background: isDarkMode ? colors.cardBackground : 'rgba(255, 255, 255, 0.8)',
              color: isDarkMode ? colors.textSecondary : colors.text,
              border: `1px solid ${isDarkMode ? colors.cardBorder : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: isDarkMode ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.05)'
            })
          }}
          aria-pressed={selected === opt.value}
          aria-label={`Filter to ${opt.label}`}
          onClick={() => onChange(opt.value)}
          onMouseEnter={(e) => {
            if (selected !== opt.value) {
              e.currentTarget.style.background = isDarkMode 
                ? colors.cardBackgroundHover 
                : 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = colors.text;
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = isDarkMode 
                ? colors.shadow 
                : '0 4px 12px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = isDarkMode 
                ? colors.cardBorderHover 
                : 'rgba(168, 85, 247, 0.2)';
            }
          }}
          onMouseLeave={(e) => {
            if (selected !== opt.value) {
              e.currentTarget.style.background = isDarkMode 
                ? colors.cardBackground 
                : 'rgba(255, 255, 255, 0.8)';
              e.currentTarget.style.color = isDarkMode ? colors.textSecondary : colors.text;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isDarkMode 
                ? 'none' 
                : '0 2px 4px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = isDarkMode 
                ? colors.cardBorder 
                : 'rgba(0, 0, 0, 0.1)';
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = '2px solid rgba(168, 85, 247, 0.5)';
            e.currentTarget.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}