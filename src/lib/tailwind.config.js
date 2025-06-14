import { useEffect, useState } from 'react';
import { supabase } from './supabase';

// Hook to fetch the number of unique chat sessions started
export function useChatsStarted() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const { count: sessionCount, error } = await supabase
          .from('chat_history')
          .select('session_id', { head: true, count: 'exact', distinct: true });
        if (error) throw error;
        setCount(sessionCount);
      } catch (err) {
        console.error('Error fetching Chats Started:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCount();
  }, []);

  return { count, loading, error };
}
