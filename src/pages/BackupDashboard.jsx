// src/pages/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import { useAuth } from '../lib/useAuth';
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
  /* --------------------------------------------------
   * Auth & global state
   * --------------------------------------------------*/
  const { session, loading: authLoading } = useAuth();
  const [dateRange, setDateRange] = useState('today');
  const [modalState, setModalState] = useState({ open: false, title: '', content: null });

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '18px' }}>Loading your dashboard...</div>
    </div>
  );
  
  if (!session) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'white', fontSize: '18px' }}>Please log in to access your dashboard.</div>
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

  // Beautiful pastel color palette for dark theme
  const pastelColors = [
    '#A78BFA', // Soft purple
    '#34D399', // Soft emerald
    '#F472B6', // Soft pink
    '#60A5FA', // Soft blue
    '#FBBF24', // Soft amber
    '#FB7185', // Soft rose
    '#A3E635', // Soft lime
    '#38BDF8', // Soft sky
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
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px',
          padding: '12px',
          color: 'white'
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
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 25%, #2a1a5e 50%, #1a1a3e 75%, #0f0f23 100%)',
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
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '25%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
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
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ flex: 1 }} />
              <div style={{ textAlign: 'center' }}>
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'transparent',
                  background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #3B82F6 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  marginBottom: '16px',
                  fontFamily: 'Montserrat, sans-serif'
                }}>
                  Yuno Analytics
                </h1>
                <p style={{
                  color: '#D1D5DB',
                  fontSize: '20px',
                  margin: 0,
                  maxWidth: '600px'
                }}>
                  Track your AI chatbot's performance and engagement with real-time insights
                </p>
              </div>
              
              {/* Theme Toggle */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '18px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Toggle Light Mode (Coming Soon)"
                >
                  ☀️
                </button>
              </div>
            </div>
            <DateRangePicker rangeOptions={ranges} selected={dateRange} onChange={setDateRange} />
          </div>
        </header>

        {/* Dashboard Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Row 1: KPI Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
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
                    wrapperStyle={{ paddingTop: '12px', color: '#E5E7EB', fontSize: '12px' }}
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
                    wrapperStyle={{ paddingTop: '12px', color: '#E5E7EB', fontSize: '12px' }}
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
                    tick={{ fill: '#E5E7EB', fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#E5E7EB', fontSize: 11 }}
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
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
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#E5E7EB', fontSize: 12 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={80} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#E5E7EB', fontSize: 12 }}
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
                background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                marginBottom: '12px',
                fontFamily: 'Montserrat, sans-serif'
              }}>
                📋 Generated Leads
              </h2>
              <p style={{
                color: '#D1D5DB',
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