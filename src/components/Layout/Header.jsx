// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  HiBell, 
  HiUser, 
  HiLogout, 
  HiCog,
  HiChevronDown,
  HiSun,
  HiMoon
} from 'react-icons/hi';

export default function Header() {
  const { user, site, logout } = useAuth();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header style={{
      height: '80px',
      background: colors.cardBackground,
      borderBottom: `1px solid ${colors.border}`,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Page Title */}
      <div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: colors.text,
          margin: 0
        }}>
          Dashboard
        </h1>
        {site && (
          <p style={{
            fontSize: '14px',
            color: colors.textSecondary,
            margin: '4px 0 0 0'
          }}>
            {site.domain}
          </p>
        )}
      </div>

      {/* Right Side */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '8px',
            color: colors.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
        </button>

        {/* Notifications */}
        <button
          style={{
            background: 'none',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '8px',
            color: colors.textSecondary,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <HiBell size={20} />
          {/* Notification badge - placeholder */}
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            background: '#ef4444',
            borderRadius: '50%',
            display: 'none' // Hide for now
          }} />
        </button>

        {/* User Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              background: 'none',
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              padding: '8px 12px',
              color: colors.text,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <HiUser size={20} />
            <span>{user?.name || user?.email}</span>
            <HiChevronDown size={16} />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              background: colors.cardBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: '200px',
              zIndex: 1000
            }}>
              <div style={{
                padding: '12px',
                borderBottom: `1px solid ${colors.border}`
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: colors.text
                }}>
                  {user?.name || 'User'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: colors.textSecondary
                }}>
                  {user?.email}
                </div>
              </div>

              <div style={{ padding: '8px 0' }}>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Navigate to settings - will implement in later weeks
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    background: 'none',
                    color: colors.text,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = colors.border + '40';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                  }}
                >
                  <HiCog size={16} />
                  Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: 'none',
                    background: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ef444420';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                  }}
                >
                  <HiLogout size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}