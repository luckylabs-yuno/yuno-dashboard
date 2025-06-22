// src/components/Layout/Sidebar.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  HiChartBar, 
  HiCog, 
  HiColorSwatch, 
  HiDocumentText, 
  HiToggleLeft,
  HiHome,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';

const menuItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: HiHome,
    path: '/dashboard'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: HiChartBar,
    path: '/dashboard/analytics'
  },
  {
    id: 'widget',
    label: 'Widget Control',
    icon: HiToggleLeft,
    path: '/dashboard/widget'
  },
  {
    id: 'customize',
    label: 'Customize',
    icon: HiColorSwatch,
    path: '/dashboard/customize'
  },
  {
    id: 'content',
    label: 'Content',
    icon: HiDocumentText,
    path: '/dashboard/content'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: HiCog,
    path: '/dashboard/settings'
  }
];

export default function Sidebar({ collapsed, onToggle }) {
  const { colors } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: collapsed ? '80px' : '280px',
      background: colors.cardBackground,
      borderRight: `1px solid ${colors.border}`,
      transition: 'width 0.3s ease',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Logo & Toggle */}
      <div style={{
        padding: '20px',
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {!collapsed && (
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            background: colors.accent,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Yuno
          </div>
        )}
        
        <button
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            color: colors.textSecondary,
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {collapsed ? <HiChevronRight size={20} /> : <HiChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '20px 0' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                padding: collapsed ? '16px 0' : '16px 20px',
                border: 'none',
                background: active ? colors.accent + '20' : 'transparent',
                color: active ? colors.accent : colors.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: active ? '600' : '400',
                transition: 'all 0.2s ease',
                borderLeft: active ? `3px solid ${colors.accent}` : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.target.style.background = colors.border + '40';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                width: collapsed ? '100%' : 'auto'
              }}>
                <Icon size={20} />
              </div>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}