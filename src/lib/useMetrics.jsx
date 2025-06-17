// src/lib/useMetrics.js
import { useState, useEffect } from 'react';
import { supabase } from './supabase.jsx';
import { useProfile } from './useProfile';

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
  const { profile, loading: profileLoading } = useProfile();
  const siteId = profile?.site_id;
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (profileLoading || !siteId) return;
    async function fetchData() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase.from('chat_history').select('session_id').eq('site_id', siteId).eq('role','assistant');
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        const unique = new Set(data.map(r => r.session_id).filter(Boolean));
        setCount(unique.size);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [range, siteId, profileLoading]);
  return { count, loading, error };
}

/** Average back-and-forth turns per session */
/** Fixed Average Depth - Consistent with useChatsStarted approach */
export function useAvgDepth(range = 'all') {
  const { profile, loading: profileLoading } = useProfile();
  const siteId = profile?.site_id;
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profileLoading || !siteId) return;
    
    async function fetchData() {
      try {
        const { since, until } = getDateBounds(range);
        
        // Query 1: Get ALL messages for the site_id, then apply date filters
        let msgQuery = supabase
          .from('chat_history')
          .select('id')  // Just need to count messages
          .eq('site_id', siteId);
        
        if (since) msgQuery = msgQuery.gte('created_at', since);
        if (until) msgQuery = msgQuery.lt('created_at', until);
        
        // Query 2: Get session_ids EXACTLY like useChatsStarted does
        // Using assistant messages to match the session counting logic
        let sessionQuery = supabase
          .from('chat_history')
          .select('session_id')
          .eq('site_id', siteId)
          .eq('role', 'assistant');  // Same filter as useChatsStarted
          
        if (since) sessionQuery = sessionQuery.gte('created_at', since);
        if (until) sessionQuery = sessionQuery.lt('created_at', until);
        
        const [{ data: messageData }, { data: sessionData }] = await Promise.all([
          msgQuery,
          sessionQuery
        ]);
        
        // Dedupe sessions at code level - EXACTLY like useChatsStarted
        const uniqueSessions = new Set(sessionData.map(r => r.session_id).filter(Boolean));
        const sessionCount = uniqueSessions.size;
        const totalMessages = messageData.length;
        
        // Calculate average
        if (sessionCount > 0) {
          // Option A: Total messages per session
          const avgDepth = totalMessages / sessionCount;
          setAvg(avgDepth);
          
          // Option B: If you want conversation turns (divide by 2)
          // const avgDepth = (totalMessages / sessionCount) / 2;
          // setAvg(avgDepth);
        } else {
          setAvg(0);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    setLoading(true);
    fetchData();
  }, [range, siteId, profileLoading]);

  return { data: avg, loading, error };
}

/** Sentiment counts for assistant replies */
export function useSentimentCounts(range = 'all') {
  const { profile, loading: profileLoading } = useProfile();
  const siteId = profile?.site_id;
  const [positive, setPositive] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [negative, setNegative] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (profileLoading || !siteId) return;
    async function fetchData() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase.from('chat_history').select('user_sentiment').eq('site_id', siteId).eq('role','assistant');
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        let pos = 0, neu = 0, neg = 0;
        data.forEach(({ user_sentiment }) => {
          if (user_sentiment.startsWith('pos')) pos++;
          else if (user_sentiment.startsWith('neg')) neg++;
          else neu++;
        });
        setPositive(pos);
        setNeutral(neu);
        setNegative(neg);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [range, siteId, profileLoading]);
  return { positive, neutral, negative, loading, error };
}

/** Intent volume for assistant replies */
export function useIntentVolumes(range = 'all') {
  const { profile, loading: profileLoading } = useProfile();
  const siteId = profile?.site_id;
  const [volumes, setVolumes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (profileLoading || !siteId) return;
    async function fetchData() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase.from('chat_history').select('intent').eq('site_id', siteId).eq('role','assistant');
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        const tally = {};
        data.forEach(({ intent }) => { tally[intent || 'unknown'] = (tally[intent || 'unknown'] || 0) + 1; });
        setVolumes(tally);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [range, siteId, profileLoading]);
  return { volumes, loading, error };
}

/** Language distribution for assistant replies */
export function useLanguageDistribution(range = 'all') {
  const { profile, loading: profileLoading } = useProfile();
  const siteId = profile?.site_id;
  const [distribution, setDistribution] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (profileLoading || !siteId) return;
    async function fetchData() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase.from('chat_history').select('lang').eq('site_id', siteId).eq('role','assistant');
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        const tally = {};
        data.forEach(({ lang }) => { tally[lang || 'unknown'] = (tally[lang || 'unknown'] || 0) + 1; });
        setDistribution(tally);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [range, siteId, profileLoading]);
  return { distribution, loading, error };
}

/** Low-confidence user questions preceding low-confidence answers */
export function useLowConfidenceQuestions(range = 'all') {
  const { profile, loading: profileLoading } = useProfile();
  const siteId = profile?.site_id;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (profileLoading || !siteId) return;
    async function fetchData() {
      try {
        const { since, until } = getDateBounds(range);
        let base = supabase
          .from('chat_history')
          .select('session_id, answer_confidence, created_at')
          .eq('site_id', siteId)
          .eq('role','assistant')
          .lt('answer_confidence', 0.7)
          .order('answer_confidence', { ascending: true })
          .limit(10);
        if (since) base = base.gte('created_at', since);
        if (until) base = base.lt('created_at', until);
        const { data: replies, error: e1 } = await base;
        if (e1) throw e1;
        const results = await Promise.all(replies.map(async r => {
          let q = supabase
            .from('chat_history')
            .select('content')
            .eq('site_id', siteId)
            .eq('session_id', r.session_id)
            .eq('role','user')
            .lt('created_at', r.created_at)
            .order('created_at', { ascending: false })
            .limit(1);
          if (since) q = q.gte('created_at', since);
          if (until) q = q.lt('created_at', until);
          const { data: qrows, error: e2 } = await q;
          if (e2) throw e2;
          return { question: qrows[0]?.content || '', confidence: r.answer_confidence };
        }));
        setItems(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [range, siteId, profileLoading]);
  return { items, loading, error };
}

/** Count of valid leads */
export function useLeads(range = 'all') {
  const { profile, loading: profileLoading } = useProfile();
  const siteId = profile?.site_id;
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (profileLoading || !siteId) return;
    async function fetchData() {
      try {
        const { since, until } = getDateBounds(range);
        let query = supabase
          .from('leads')
          .select('name, email, phone, intent, created_at')
          .eq('site_id', siteId)
          .order('created_at', { ascending: false });
        if (since) query = query.gte('created_at', since);
        if (until) query = query.lt('created_at', until);
        const { data, error } = await query;
        if (error) throw error;
        setLeads(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchData();
  }, [range, siteId, profileLoading]);
  return { leads, loading, error };
}

/** Leads-to-chats ratio */
export function useLeadRate(range = 'all') {
  const { count, loading: l1, error: e1 } = useChatsStarted(range);
  const { leads, loading: l2, error: e2 } = useLeads(range);
  const loading = l1 || l2;
  const error = e1 || e2;
  const rate = !loading && count > 0 ? leads.length / count : null;
  return { data: rate, loading, error };
}
