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
    return saved ? JSON.parse(saved) : true; // Default to dark mode
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
    colors: isDarkMode ? {
      // Dark Mode Colors
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2a1a5e 50%, #1a1a3e 75%, #0f0f23 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.08)',
      cardBackgroundHover: 'rgba(255, 255, 255, 0.12)',
      cardBorder: 'rgba(255, 255, 255, 0.12)',
      cardBorderHover: 'rgba(255, 255, 255, 0.2)',
      text: '#FFFFFF',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      textMuted: 'rgba(255, 255, 255, 0.5)',
      accent: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #3B82F6 100%)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      shadowHover: '0 20px 40px rgba(0, 0, 0, 0.4)',
      orb1: 'rgba(147, 51, 234, 0.1)',
      orb2: 'rgba(236, 72, 153, 0.1)'
    } : {
      // Light Mode Colors
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.7)',
      cardBackgroundHover: 'rgba(255, 255, 255, 0.9)',
      cardBorder: 'rgba(255, 255, 255, 0.8)',
      cardBorderHover: 'rgba(147, 51, 234, 0.3)',
      text: '#1e293b',
      textSecondary: '#475569',
      textMuted: '#64748b',
      accent: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #3B82F6 100%)',
      shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      shadowHover: '0 20px 40px rgba(0, 0, 0, 0.15)',
      orb1: 'rgba(147, 51, 234, 0.08)',
      orb2: 'rgba(236, 72, 153, 0.08)'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};