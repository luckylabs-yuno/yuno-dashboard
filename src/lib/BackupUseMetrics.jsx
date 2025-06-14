// ================================
// FILE: src/lib/useMetrics.js
// ================================
import { useState, useEffect } from 'react';
import { supabase } from './supabase.jsx';

const SITE_ID = import.meta.env.VITE_SITE_ID;

/**
 * Returns ISO bounds { since, until } for given range key
 */
function getDateBounds(range) {
  const now = new Date();
  let since = null;
  let until = null;

  switch (range) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      since = start.toISOString();
      until = now.toISOString();
      break;
    }
    case 'yesterday': {
      const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startYesterday = new Date(startToday);
      startYesterday.setDate(startYesterday.getDate() - 1);
      since = startYesterday.toISOString();
      until = startToday.toISOString();
      break;
    }
    case '7d':
      since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case '30d':
      since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      break;
    case 'month':
      since = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      break;
    case 'all':
    default:
      since = null;
  }

  return { since, until };
}

/** Number of unique chat sessions */
export function useChatsStarted(range = 'all') {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase
          .from('chat_history')
          .select('session_id')
          .eq('site_id', SITE_ID)
          .eq('role', 'assistant');
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);

        const { data, error } = await query;
        if (error) throw error;
        const unique = new Set(data.map(r => r.session_id).filter(Boolean));
        setCount(unique.size);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetch();
  }, [range]);

  return { count, loading, error };
}

/** Average back-and-forth turns per session */
export function useAvgDepth(range = 'all') {
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { since, until } = getDateBounds(range);

        let msgQ = supabase.from('chat_history').select('id', { count: 'exact' }).eq('site_id', SITE_ID);
        let sesQ = supabase.from('chat_history').select('session_id', { count: 'exact', distinct: 'session_id' }).eq('site_id', SITE_ID);
        if (since) {
          msgQ = msgQ.gte('created_at', since);
          sesQ = sesQ.gte('created_at', since);
        }
        if (until) {
          msgQ = msgQ.lt('created_at', until);
          sesQ = sesQ.lt('created_at', until);
        }

        const [{ count: total }, { count: sessions }] = await Promise.all([
          msgQ,
          sesQ,
        ].map(q => q));
        setAvg((total / sessions) / 2);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetch();
  }, [range]);

  return { data: avg, loading, error };
}

/** Count of valid leads */
export function useLeads(range = 'all') {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase
          .from('leads')
          .select('name, email, phone, intent, created_at')
          .eq('site_id', SITE_ID)
          .order('created_at', { ascending: false });
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        setLeads(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetch();
  }, [range]);

  return { leads, loading, error };
}

/** Leads / chats ratio */
export function useLeadRate(range = 'all') {
  const { count, loading: lc, error: le } = useChatsStarted(range);
  const { leads, loading: ll, error: le2 } = useLeads(range);
  const loading = lc || ll;
  const error = le || le2;
  const rate = !loading && count > 0 ? leads.length / count : null;
  return { data: rate, loading, error };
}

/** Sentiment counts for assistant replies */
export function useSentimentCounts(range = 'all') {
  const [positive, setPos] = useState(0);
  const [neutral, setNeu] = useState(0);
  const [negative, setNeg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase
          .from('chat_history')
          .select('user_sentiment')
          .eq('site_id', SITE_ID)
          .eq('role', 'assistant');
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        let pos=0, neu=0, neg=0;
        data.forEach(({ user_sentiment }) => {
          if (user_sentiment.startsWith('pos')) pos++;
          else if (user_sentiment.startsWith('neg')) neg++;
          else neu++;
        });
        setPos(pos); setNeu(neu); setNeg(neg);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetch();
  }, [range]);

  return { positive, neutral, negative, loading, error };
}

/** Intent volume for assistant replies */
export function useIntentVolumes(range = 'all') {
  const [volumes, setVolumes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase
          .from('chat_history')
          .select('intent')
          .eq('site_id', SITE_ID)
          .eq('role', 'assistant');
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        const tally = {};
        data.forEach(({ intent }) => { tally[intent||'unknown'] = (tally[intent||'unknown']||0)+1; });
        setVolumes(tally);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetch();
  }, [range]);

  return { volumes, loading, error };
}

/** Language distribution for assistant replies */
export function useLanguageDistribution(range = 'all') {
  const [dist, setDist] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase
          .from('chat_history')
          .select('lang')
          .eq('site_id', SITE_ID)
          .eq('role', 'assistant');
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        const tally = {};
        data.forEach(({ lang }) => { tally[lang||'unknown'] = (tally[lang||'unknown']||0)+1; });
        setDist(tally);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetch();
  }, [range]);

  return { distribution: dist, loading, error };
}

/** Low-confidence user questions preceding low-confidence answers */
export function useLowConfidenceQuestions(range = 'all') {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { since, until } = getDateBounds(range);
        let base = supabase
          .from('chat_history')
          .select('session_id, answer_confidence, created_at')
          .eq('site_id', SITE_ID)
          .eq('role', 'assistant')
          .lt('answer_confidence', 0.7)
          .order('answer_confidence', { ascending: true })
          .limit(10);
        if (since) base = base.gte('created_at', since);
        if (until) base = base.lt('created_at', until);

        const { data: replies, error: e1 } = await base;
        if (e1) throw e1;

        const results = await Promise.all(
          replies.map(async r => {
            let q = supabase
              .from('chat_history')
              .select('content')
              .eq('site_id', SITE_ID)
              .eq('session_id', r.session_id)
              .eq('role', 'user')
              .lt('created_at', r.created_at)
              .order('created_at', { ascending: false })
              .limit(1);
            if (since) q = q.gte('created_at', since);
            if (until) q = q.lt('created_at', until);
            const { data: qrows, error: e2 } = await q;
            if (e2) throw e2;
            return { question: qrows[0]?.content||'', confidence: r.answer_confidence };
          })
        );
        setItems(results);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetch();
  }, [range]);

  return { items, loading, error };
}
