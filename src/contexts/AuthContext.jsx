import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiClient } from '../lib/apiClient';

const AuthContext = createContext();

// Auth states
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT'
};

const initialState = {
  user: null,
  site: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        site: action.payload.site,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case AUTH_ACTIONS.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case AUTH_ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };
    
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Token management
  const getToken = () => localStorage.getItem('yuno_dashboard_token');
  const setToken = (token) => localStorage.setItem('yuno_dashboard_token', token);
  const removeToken = () => localStorage.removeItem('yuno_dashboard_token');

  // Check if user is authenticated on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      try {
        const response = await apiClient.verifyDashboardToken();
        dispatch({ 
          type: AUTH_ACTIONS.SET_USER, 
          payload: response.data 
        });
      } catch (error) {
        console.error('Auth initialization failed:', error);
        removeToken();
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initAuth();
  }, []);

  const login = async (token) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      setToken(token);
      const response = await apiClient.verifyDashboardToken();
      
      dispatch({ 
        type: AUTH_ACTIONS.SET_USER, 
        payload: response.data 
      });
      
      return response;
    } catch (error) {
      removeToken();
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message || 'Login failed' 
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.dashboardLogout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      removeToken();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  const refreshToken = async () => {
    try {
      const response = await apiClient.refreshDashboardToken();
      setToken(response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.updateUserProfile(profileData);
      
      // Update user in state
      dispatch({
        type: AUTH_ACTIONS.SET_USER,
        payload: {
          ...state,
          user: { ...state.user, ...response.data }
        }
      });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: error.message || 'Profile update failed' 
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const contextValue = {
    ...state,
    login,
    logout,
    refreshToken,
    updateProfile,
    clearError,
    getToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}