// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('yuno-theme');
    return saved ? JSON.parse(saved) : true; // default to dark
  });

  useEffect(() => {
    localStorage.setItem('yuno-theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode
      ? {
          // Dark Mode (Yuno Dark Theme)
          background: 'linear-gradient(to bottom right, #111827, #1e293b, #1e3a8a)',  // Hero gradient :contentReference[oaicite:0]{index=0}
          cardBackground: 'rgba(31, 41, 55, 0.8)',                                    // Glass bg :contentReference[oaicite:1]{index=1}
          cardBackgroundHover: 'rgba(17, 24, 39, 0.9)',                               // Hover bg :contentReference[oaicite:2]{index=2}
          cardBorder: 'rgba(75, 85, 99, 0.3)',                                        // Glass border :contentReference[oaicite:3]{index=3}
          cardBorderHover: 'rgba(107, 114, 128, 0.5)',                                // Hover border :contentReference[oaicite:4]{index=4}
          text: '#ffffff',                                                            // Primary text :contentReference[oaicite:5]{index=5}
          textSecondary: '#e5e7eb',                                                   // Body text :contentReference[oaicite:6]{index=6}
          textMuted: '#9ca3af',                                                       // Muted text :contentReference[oaicite:7]{index=7}
          accent: 'linear-gradient(to right, #2563eb, #06b6d4)',                      // Brand CTA gradient :contentReference[oaicite:8]{index=8}
          shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',                            // Glass shadow :contentReference[oaicite:9]{index=9}
          shadowHover: '0 25px 50px -12px rgba(37, 99, 235, 0.3)',                    // Hover shadow :contentReference[oaicite:10]{index=10}
          orb1: 'rgba(37, 99, 235, 0.1)',
          orb2: 'rgba(6, 182, 212, 0.1)'
        }
      : {
          // Light Mode (your original soft gradient + Yuno accents)
          background:
            'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)',
          cardBackground: 'rgba(255, 255, 255, 0.7)',
          cardBackgroundHover: 'rgba(255, 255, 255, 0.9)',
          cardBorder: 'rgba(156, 163, 175, 0.3)',
          cardBorderHover: 'rgba(75, 85, 99, 0.4)',
          text: '#1e293b',
          textSecondary: '#475569',
          textMuted: '#64748b',
          accent: 'linear-gradient(to right, #2563eb, #06b6d4)',                      // Brand CTA gradient
          shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          shadowHover: '0 20px 40px rgba(0, 0, 0, 0.15)',
          orb1: 'rgba(37, 99, 235, 0.08)',
          orb2: 'rgba(6, 182, 212, 0.08)'
        }
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
