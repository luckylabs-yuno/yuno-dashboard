import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorBoundary from '../ui/ErrorBoundary';

export default function DashboardLayout() {
  const { isLoading, error } = useAuth();
  const { colors } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.background
      }}>
        <div style={{
          background: colors.cardBackground,
          border: `1px solid ${colors.border}`,
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: colors.text, marginBottom: '16px' }}>
            Authentication Error
          </h2>
          <p style={{ color: colors.textSecondary, marginBottom: '16px' }}>
            {error}
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              background: colors.accent,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={{
        minHeight: '100vh',
        background: colors.background,
        display: 'flex'
      }}>
        {/* Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main Content */}
        <div style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? '80px' : '280px',
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <Header />
          
          {/* Page Content */}
          <main style={{
            flex: 1,
            padding: '24px',
            overflow: 'auto'
          }}>
            <Outlet />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}