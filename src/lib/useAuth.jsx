// src/lib/useAuth.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext({ session: null });

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // load existing session (if page refresh)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
