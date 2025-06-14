// src/pages/Dashboard.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../lib/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import {
  useChatsStarted,
  useAvgDepth,
  useSentimentCounts,
  useIntentVolumes,
  useLanguageDistribution,
  useLowConfidenceQuestions,
  useLeads,
  useLeadRate
} from '../lib/useMetrics';
import KpiCard from '../components/KpiCard';
import ChartCard from '../components/ChartCard';
import DataTable from '../components/DataTable';
import DateRangePicker from '../components/DateRangePicker';
import Modal from '../components/Modal';
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';

export default function Dashboard() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const { session, loading: authLoading } = useAuth();
  const [dateRange, setDateRange] = useState('today');
  const [modalState, setModalState] = useState({ open: false, title: '', content: null });
  const [userProfile, setUserProfile] = useState(null);
  const [siteInfo, setSiteInfo] = useState(null);

  // Fetch user profile and site info
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        // Fetch user profile (which contains site_id and domain in the same row)
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          setUserProfile(profile);
          // No need for separate site query - site_id and domain are in the same profile row
          setSiteInfo({
            site_id: profile.site_id,
            domain: profile.domain,
            plan: profile.plan
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [session]);

  /* --------------------------------------------------
   * Data hooks (always in the same order!)
   * --------------------------------------------------*/
  const { count: chatsStarted, loading: loadChats, error: errChats } = useChatsStarted(dateRange);
  const { data: avgDepth, loading: loadDepth, error: errDepth } = useAvgDepth(dateRange);
  const { leads, loading: loadLeads, error: errLeads } = useLeads(dateRange);
  const { data: leadRate, loading: loadRate, error: errRate } = useLeadRate(dateRange);
  const { positive, neutral, negative, loading: loadSent, error: errSent } = useSentimentCounts(dateRange);
  const { volumes: chatIntentVol, loading: loadIntent, error: errIntent } = useIntentVolumes(dateRange);
  const { distribution: langDist, loading: loadLang, error: errLang } = useLanguageDistribution(dateRange);
  const { items: lowConf, loading: loadLow, error: errLow } = useLowConfidenceQuestions(dateRange);

  /* --------------------------------------------------
   * Early‑return states
   * --------------------------------------------------*/
  if (authLoading) return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.background, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ color: colors.text, fontSize: '18px' }}>Loading your dashboard...</div>
    </div>
  );
  
  if (!session) return (
    <div style={{ 
      minHeight: '100vh', 
      background: colors.background, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div style={{ color: colors.text, fontSize: '18px' }}>Please log in to access your dashboard.</div>
    </div>
  );

  /* --------------------------------------------------
   * Filter leads to only count valid ones (email OR phone)
   * --------------------------------------------------*/
  const validLeads = useMemo(() => {
    return leads.filter(lead => lead.email || lead.phone);
  }, [leads]);

  /* --------------------------------------------------
   * Transform lead‑intent data locally (using valid leads only)
   * --------------------------------------------------*/
  const leadIntentData = useMemo(() => {
    const tally = {};
    validLeads.forEach(l => {
      const key = l.intent || 'Unknown';
      tally[key] = (tally[key] || 0) + 1;
    });
    return Object.entries(tally).map(([name, value]) => ({ name, value }));
  }, [validLeads]);

  /* --------------------------------------------------
   * Chart data & pastel colours
   * --------------------------------------------------*/
  const sentimentData = [
    { name: 'Positive', value: positive },
    { name: 'Neutral', value: neutral },
    { name: 'Negative', value: negative },
  ];

  // Theme-aware pastel colors
  const pastelColors = isDarkMode ? [
    '#A78BFA', '#34D399', '#F472B6', '#60A5FA', 
    '#FBBF24', '#FB7185', '#A3E635', '#38BDF8'
  ] : [
    '#8B5CF6', '#10B981', '#EC4899', '#3B82F6',
    '#F59E0B', '#EF4444', '#84CC16', '#06B6D4'
  ];

  const chatIntentData = Object.entries(chatIntentVol || {}).map(([name, value]) => ({ name, value }));
  const langData = Object.entries(langDist || {}).map(([name, value]) => ({ name, value }));

  /* --------------------------------------------------
   * Table columns (prepend S.no)
   * --------------------------------------------------*/
  const leadsIndexed = useMemo(() => validLeads.map((l, i) => ({ ...l, _i: i + 1 })), [validLeads]);
  const leadCols = [
    { key: '_i', header: 'S.no' },
    { key: 'name', header: 'Name' },
    { 
      key: 'contact', 
      header: 'Email / Phone', 
      render: r => r.email || r.phone || '—' 
    },
    { key: 'intent', header: 'Intent' },
  ];

  /* --------------------------------------------------
   * Date‑range picker options
   * --------------------------------------------------*/
  const ranges = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7d', value: '7d' },
    { label: 'Last 30d', value: '30d' },
    { label: 'This Month', value: 'month' },
    { label: 'All Time', value: 'all' },
  ];

  /* --------------------------------------------------
   * Custom Tooltip Component
   * --------------------------------------------------*/
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '8px',
          padding: '12px',
          color: colors.text,
          boxShadow: colors.shadow
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  /* --------------------------------------------------
   * Render
   * --------------------------------------------------*/
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '25%',
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${colors.orb1} 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '25%',
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>
      
      {/* Main Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        
        {/* Header */}
        <header style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            {/* Top Bar with User Info and Theme Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: colors.cardBackground,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.cardBorder}`,
              borderRadius: '20px',
              padding: '16px 20px',
              boxShadow: colors.shadow,
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              {/* User Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: colors.accent,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: '16px',
                  fontFamily: 'Montserrat, sans-serif',
                  flexShrink: 0
                }}>
                  {session?.user?.email?.[0]?.toUpperCase()}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    color: colors.text,
                    fontWeight: '600',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {session?.user?.email}
                  </div>
                  {siteInfo && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '6px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: colors.cardBackgroundHover,
                        padding: '3px 6px',
                        borderRadius: '6px',
                        border: `1px solid ${colors.cardBorder}`,
                        fontSize: '11px'
                      }}>
                        <span style={{
                          color: colors.textSecondary,
                          fontFamily: 'Inter, sans-serif',
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          fontWeight: '600'
                        }}>
                          ID:
                        </span>
                        <span style={{
                          color: colors.text,
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: '600'
                        }}>
                          {siteInfo.site_id}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: colors.cardBackgroundHover,
                        padding: '3px 6px',
                        borderRadius: '6px',
                        border: `1px solid ${colors.cardBorder}`,
                        fontSize: '11px',
                        maxWidth: '120px'
                      }}>
                        <span style={{
                          color: '#10B981',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: '600',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {siteInfo.domain}
                        </span>
                      </div>
                      {siteInfo.plan && (
                        <div style={{
                          background: colors.accent,
                          padding: '3px 6px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 4px rgba(168, 85, 247, 0.2)',
                          fontSize: '10px'
                        }}>
                          <span style={{
                            color: '#FFFFFF',
                            fontFamily: 'Inter, sans-serif',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            fontWeight: '700'
                          }}>
                            {siteInfo.plan}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                style={{
                  padding: '10px',
                  background: colors.cardBackground,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.cardBorder}`,
                  borderRadius: '10px',
                  color: colors.text,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.cardBackgroundHover;
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = colors.cardBorderHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.cardBackground;
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = colors.cardBorder;
                }}
                title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
              >
                <span>{isDarkMode ? '☀️' : '🌙'}</span>
                <span style={{ fontSize: '11px', fontWeight: '500' }}>
                  {isDarkMode ? 'Light' : 'Dark'}
                </span>
              </button>
            </div>

            {/* Main Title */}
            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: 'clamp(32px, 8vw, 48px)',
                fontWeight: 'bold',
                color: 'transparent',
                background: colors.accent,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                marginBottom: '16px',
                fontFamily: 'Montserrat, sans-serif',
                lineHeight: '1.1'
              }}>
                Yuno Analytics
              </h1>
              <p style={{
                color: colors.textSecondary,
                fontSize: 'clamp(16px, 4vw, 20px)',
                margin: 0,
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.4',
                padding: '0 16px'
              }}>
                Track your AI chatbot's performance and engagement with real-time insights
              </p>
            </div>

            {/* Date Range Picker */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DateRangePicker rangeOptions={ranges} selected={dateRange} onChange={setDateRange} />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Row 1: KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            <KpiCard 
              title="Chats Started" 
              subtitle="Total unique conversations initiated"
              value={chatsStarted} 
              loading={loadChats} 
              error={errChats}
            />
            <KpiCard 
              title="Chat Depth" 
              subtitle="Average messages per conversation"
              value={avgDepth?.toFixed(1)} 
              loading={loadDepth} 
              error={errDepth}
            />
            <KpiCard 
              title="Leads Generated" 
              subtitle="Contacts with email or phone captured"
              value={validLeads.length} 
              loading={loadLeads} 
              error={errLeads}
            />
          </div>

          {/* Row 2: Charts and Chat Intent */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            <ChartCard 
              title="Chat Sentiment" 
              subtitle="Emotional tone of conversations"
              loading={loadSent} 
              error={errSent}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie 
                    data={sentimentData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={75}
                    innerRadius={45}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {sentimentData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={pastelColors[index % pastelColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={24}
                    wrapperStyle={{ paddingTop: '12px', color: colors.textSecondary, fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard 
              title="Language Distribution" 
              subtitle="Languages used in conversations"
              loading={loadLang} 
              error={errLang}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie 
                    data={langData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={75}
                    innerRadius={45}
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {langData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={pastelColors[(index + 3) % pastelColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={24}
                    wrapperStyle={{ paddingTop: '12px', color: colors.textSecondary, fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard 
              title="Chat Intent Volumes" 
              subtitle="Most common conversation topics"
              loading={loadIntent} 
              error={errIntent}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart 
                  data={chatIntentData.slice(0, 6)} 
                  margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                >
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: colors.textSecondary, fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: colors.textSecondary, fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                    animationBegin={400}
                  >
                    {chatIntentData.slice(0, 6).map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={pastelColors[index % pastelColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Row 3: Lead Analytics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            <KpiCard 
              title="Lead Conversion Rate" 
              subtitle="Percentage of chats that generate leads"
              value={leadRate != null ? `${(leadRate * 100).toFixed(1)}%` : '—'} 
              loading={loadRate} 
              error={errRate}
            />

            <ChartCard 
              title="Lead Intent Breakdown" 
              subtitle="What leads are most interested in"
              loading={loadLeads} 
              error={errLeads}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart 
                  data={leadIntentData} 
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                >
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: colors.textSecondary, fontSize: 12 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: colors.textSecondary, fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 6, 6, 0]}
                    animationDuration={1000}
                    animationBegin={600}
                  >
                    {leadIntentData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={pastelColors[(index + 4) % pastelColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Row 4: Leads Table */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'transparent',
                background: colors.accent,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                marginBottom: '12px',
                fontFamily: 'Montserrat, sans-serif'
              }}>
                📋 Generated Leads
              </h2>
              <p style={{
                color: colors.textSecondary,
                fontSize: '18px',
                margin: 0
              }}>
                All contacts who provided email or phone information during conversations
              </p>
            </div>
            
            <DataTable 
              columns={leadCols} 
              data={leadsIndexed} 
              loading={loadLeads} 
              error={errLeads} 
            />
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalState.open}
          onClose={() => setModalState({ open: false, title: '', content: null })}
          title={modalState.title}
        >
          {modalState.content}
        </Modal>
      </div>
    </div>
  );
}
