// src/lib/useProfile.js
import { useState, useEffect } from 'react';
import { supabase } from './supabase.jsx';
import { useAuth } from './useAuth';

export function useProfile() {
  const { session, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !session) return;
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('site_id, domain, plan, metadata')
          .eq('id', session.user.id)
          .single();
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('useProfile error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [authLoading, session]);

  return { profile, loading, error };
}
