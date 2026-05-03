import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Shield } from 'lucide-react';
import AppHeader from './components/Header';
import Sidebar from './components/Sidebar';
import LogViewer from './components/LogViewer';
import StatsPanel from './components/StatsPanel';
import Timeline from './components/Timeline';
import ThreatHeatmap from './components/ThreatHeatmap';
import TrendChart from './components/TrendChart';
import SettingsPanel from './components/SettingsPanel';
import { fetchStats, fetchLogs, fetchTrends } from './services/api';

interface Stats {
  total_logs: number;
  anomalies: number;
  normal: number;
  detection_rate: number;
  threat_level: string;
  timestamp: string;
}

type ViewId = 'overview' | 'logs' | 'threats' | 'analytics';

function App() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshRate, setRefreshRate] = useState(2000);
  const [trendWindow, setTrendWindow] = useState<'1h' | '1d' | '1w'>('1h');
  const [showSettings, setShowSettings] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>('overview');
  const [error, setError] = useState<string | null>(null);
  const [showAnimations, setShowAnimations] = useState(true);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (!hasLoadedRef.current) setLoading(true);
      else setRefreshing(true);
      setError(null);
      try {
        const [statsData, logsData, trendsData] = await Promise.all([
          fetchStats(),
          fetchLogs(0, 200),
          fetchTrends(trendWindow),
        ]);
        setStats(statsData);
        setLogs(logsData.logs || []);
        setTrends(trendsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        if (!hasLoadedRef.current) {
          hasLoadedRef.current = true;
          setLoading(false);
          setTimeout(() => setShowAnimations(false), 600);
        } else {
          setRefreshing(false);
        }
      }
    };
    loadData();
    const interval = setInterval(loadData, refreshRate);
    return () => clearInterval(interval);
  }, [refreshRate, trendWindow]);

  const handleViewChange = useCallback((v: ViewId) => {
    setActiveView(v);
    setShowSettings(false);
  }, []);

  const handleSettingsClick = useCallback(() => {
    setActiveView('overview');
    setShowSettings(s => !s);
  }, []);

  const handleTrendWindowChange = useCallback((window: '1h' | '1d' | '1w') => {
    setTrendWindow(window);
  }, []);

  const handleRefreshRateChange = useCallback((rate: number) => {
    setRefreshRate(rate);
  }, []);

  // ── Shared sub-header metrics bar ─────────────────────────────
  const MetricsBar = () => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 24,
      padding: '8px 0 18px', overflowX: 'auto',
      borderBottom: '1px solid rgba(148,163,184,0.06)',
      marginBottom: 22,
    }}>
      {[
        { label: 'Total Logs',   value: stats?.total_logs?.toLocaleString() ?? '—',                             color: '#38bdf8' },
        { label: 'Anomalies',    value: stats?.anomalies?.toLocaleString() ?? '—',                               color: '#f87171' },
        { label: 'Clean',        value: stats?.normal?.toLocaleString() ?? '—',                                   color: '#4ade80' },
        { label: 'Last Update',  value: stats ? new Date(stats.timestamp).toLocaleTimeString() : '—',            color: '#94a3b8' },
      ].map(m => (
        <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.45)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {m.label}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: m.color, fontFamily: 'JetBrains Mono, monospace' }}>
            {loading ? '—' : m.value}
          </span>
        </div>
      ))}
    </div>
  );

  // ── Memoized Views ────────────────────────────────────────────────
  
  const OverviewView = useMemo(() => () => (
    <div>
      <MetricsBar />
      <section className={showAnimations ? "animate-fade-up" : ""} style={{ marginBottom: 20 }}>
        <StatsPanel stats={stats} loading={loading} />
      </section>
      <section className="log-threats-grid" style={{ display: 'grid', gap: 16, marginBottom: 16 }}>
        <style>{`
          .log-threats-grid { grid-template-columns: 1fr; }
          @media (min-width: 960px) { .log-threats-grid { grid-template-columns: 1fr 300px; } }
        `}</style>
        <div className={showAnimations ? "animate-fade-up delay-100" : ""} style={{ height: 360 }}>
          <LogViewer logs={logs} loading={loading} />
        </div>
        <div className={showAnimations ? "animate-fade-up delay-150" : ""} style={{ height: 360 }}>
          <Timeline logs={logs} />
        </div>
      </section>
      <section className="charts-grid" style={{ display: 'grid', gap: 16 }}>
        <style>{`
          .charts-grid { grid-template-columns: 1fr; }
          @media (min-width: 700px) { .charts-grid { grid-template-columns: 1fr 1fr; } }
        `}</style>
        <div className={showAnimations ? "animate-fade-up delay-200" : ""}><TrendChart trends={trends} trendWindow={trendWindow} onWindowChange={handleTrendWindowChange} /></div>
        <div className={showAnimations ? "animate-fade-up delay-300" : ""}><ThreatHeatmap trends={trends} /></div>
      </section>
    </div>
  ), [stats, logs, trends, loading, showAnimations, trendWindow, handleTrendWindowChange]);

  const LogsView = useMemo(() => () => (
    <div>
      <MetricsBar />
      <section className={showAnimations ? "animate-fade-up" : ""} style={{ height: 'calc(100vh - 220px)', minHeight: 400 }}>
        <LogViewer logs={logs} loading={loading} />
      </section>
    </div>
  ), [logs, loading, showAnimations]);

  const ThreatsView = useMemo(() => () => (
    <div>
      <MetricsBar />
      <section className="threats-grid" style={{ display: 'grid', gap: 16, alignItems: 'start' }}>
        <style>{`
          .threats-grid { grid-template-columns: 1fr; }
          @media (min-width: 960px) { .threats-grid { grid-template-columns: 1fr 340px; } }
        `}</style>
        <div className={showAnimations ? "animate-fade-up" : ""} style={{ height: 'calc(100vh - 200px)', minHeight: 400 }}>
          <Timeline logs={logs} />
        </div>
        <div className={showAnimations ? "animate-fade-up delay-100" : ""} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <StatsPanel stats={stats} loading={loading} />
        </div>
      </section>
    </div>
  ), [logs, stats, loading, showAnimations]);

  const AnalyticsView = useMemo(() => () => (
    <div>
      <MetricsBar />
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className={showAnimations ? "animate-fade-up" : ""}><TrendChart trends={trends} trendWindow={trendWindow} onWindowChange={handleTrendWindowChange} /></div>
        <div className={showAnimations ? "animate-fade-up delay-100" : ""}><ThreatHeatmap trends={trends} /></div>
      </section>
      <section className={showAnimations ? "animate-fade-up delay-200" : ""}>
        <StatsPanel stats={stats} loading={loading} />
      </section>
    </div>
  ), [trends, trendWindow, handleTrendWindowChange, showAnimations, stats]);

  const VIEW_MAP: Record<ViewId, React.ReactNode> = useMemo(() => ({
    overview:  <OverviewView />,
    logs:      <LogsView />,
    threats:   <ThreatsView />,
    analytics: <AnalyticsView />,
  }), [OverviewView, LogsView, ThreatsView, AnalyticsView]);

  return (
    <div className="app-shell bg-line-grid" style={{ background: 'linear-gradient(135deg, #020817 0%, #050d1f 60%, #020817 100%)' }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '8%', right: '12%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '18%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        stats={stats}
        onSettingsClick={handleSettingsClick}
      />

      {/* Main area */}
      <div className="app-main" style={{ position: 'relative', zIndex: 1 }}>
        <AppHeader
          stats={stats}
          loading={loading}
          refreshing={refreshing}
          activeView={activeView}
        />

        <main className="app-content">
          {/* Error banner */}
          {error && (
            <div className={showAnimations ? "animate-fade-up" : ""} style={{
              background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10, padding: '11px 16px', marginBottom: 18,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Shield size={15} style={{ color: '#f87171', flexShrink: 0 }} />
              <div>
                <p style={{ color: '#fca5a5', fontWeight: 600, fontSize: 13 }}>Cannot reach backend</p>
                <p style={{ color: '#f87171', fontSize: 11, marginTop: 2, opacity: 0.75 }}>
                  Run: <code style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,0,0,0.35)', padding: '1px 6px', borderRadius: 4 }}>cd backend && python app.py</code>
                </p>
              </div>
            </div>
          )}

          {/* Settings panel (inline, collapsible) */}
          {showSettings && (
            <div className={showAnimations ? "animate-fade-up" : ""} style={{ marginBottom: 18 }}>
              <SettingsPanel
                refreshRate={refreshRate}
                onRefreshRateChange={handleRefreshRateChange}
                onClose={() => setShowSettings(false)}
              />
            </div>
          )}

          {/* Routed view */}
          {VIEW_MAP[activeView]}
        </main>
      </div>
    </div>
  );
}

export default App;
