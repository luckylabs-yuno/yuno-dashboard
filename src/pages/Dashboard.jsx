// src/pages/Dashboard.jsx
import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Changed from '../lib/useAuth'
import { useTheme } from '../contexts/ThemeContext';
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
  const { colors, isDarkMode } = useTheme(); // Removed toggleTheme
  const { user, site } = useAuth(); // Using new AuthContext
  const [dateRange, setDateRange] = useState('today');
  const [modalState, setModalState] = useState({ open: false, title: '', content: null });

  // Remove the old useEffect for fetching user data - now handled by AuthContext
  // Remove userProfile and siteInfo state - now comes from useAuth

  /* --------------------------------------------------
   * Data hooks (using site from AuthContext)
   * --------------------------------------------------*/
  const { count: chatsStarted, loading: loadChats, error: errChats } = useChatsStarted(dateRange);
  const { data: avgDepth, loading: loadDepth, error: errDepth } = useAvgDepth(dateRange);
  const { leads, loading: loadLeads, error: errLeads } = useLeads(dateRange);
  const { data: leadRate, loading: loadRate, error: errRate } = useLeadRate(dateRange);
  const { positive, neutral, negative, loading: loadSent, error: errSent } = useSentimentCounts(dateRange);
  const { volumes: chatIntentVol, loading: loadIntent, error: errIntent } = useIntentVolumes(dateRange);
  const { distribution: langDist, loading: loadLang, error: errLang } = useLanguageDistribution(dateRange);
  const { items: lowConf, loading: loadLow, error: errLow } = useLowConfidenceQuestions(dateRange);

  // Remove early return states - now handled by AuthContext and ProtectedRoute

  /* --------------------------------------------------
   * Filter leads to only count valid ones (email OR phone)
   * --------------------------------------------------*/
  const validLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter(lead => lead && (lead.email || lead.phone));
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
    { name: 'Positive', value: positive || 0 },
    { name: 'Neutral', value: neutral || 0 },
    { name: 'Negative', value: negative || 0 },
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
        filter: 'blur(60px)',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '25%',
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${colors.orb2} 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 1
      }}></div>
      
      {/* Main Content Container */}
      <div style={{
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Page Header with Date Picker */}
        <div style={{ 
          marginBottom: '32px',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(28px, 6vw, 36px)',
              fontWeight: 'bold',
              color: 'transparent',
              background: colors.accent,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              margin: 0,
              fontFamily: 'Montserrat, sans-serif',
              lineHeight: '1.2'
            }}>
              Analytics Overview
            </h1>
            <p style={{
              color: colors.textSecondary,
              fontSize: 'clamp(14px, 3vw, 18px)',
              margin: '8px 0 0 0',
              lineHeight: '1.4'
            }}>
              Track your AI chatbot's performance and engagement with real-time insights
            </p>
          </div>
          
          <DateRangePicker 
            rangeOptions={ranges} 
            selected={dateRange} 
            onChange={setDateRange} 
          />
        </div>
        
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
              value={chatsStarted || 0} 
              loading={loadChats} 
              error={errChats}
            />
            <KpiCard 
              title="Chat Depth" 
              subtitle="Average messages per conversation"
              value={avgDepth ? avgDepth.toFixed(1) : '0.0'} 
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