import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './components/Layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Your existing dashboard page
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard sub-routes */}
              <Route index element={<Dashboard />} />
              {/* Placeholder routes for future weeks */}
              <Route path="analytics" element={<div>Analytics Page - Coming Soon</div>} />
              <Route path="widget" element={<div>Widget Control - Coming Soon</div>} />
              <Route path="customize" element={<div>Customize - Coming Soon</div>} />
              <Route path="content" element={<div>Content Management - Coming Soon</div>} />
              <Route path="settings" element={<div>Settings - Coming Soon</div>} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;