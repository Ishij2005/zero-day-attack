import React from 'react';
import { AlertTriangle, Activity, Shield, CheckCircle2, RefreshCw } from 'lucide-react';

interface HeaderProps {
  stats: any;
  loading: boolean;
  refreshing: boolean;
  activeView: string;
}

const VIEW_LABELS: Record<string, { title: string; sub: string }> = {
  overview:  { title: 'Dashboard Overview',    sub: 'Real-time threat intelligence at a glance'   },
  logs:      { title: 'Live Log Stream',        sub: 'Streaming network event feed'                },
  threats:   { title: 'Threat Feed',            sub: 'Recent anomalies and attack events'          },
  analytics: { title: 'Analytics',              sub: 'Trend analysis and threat distribution'      },
};

const THREAT_META: Record<string, { color: string; bg: string; border: string }> = {
  CRITICAL: { color: '#f87171', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)'  },
  HIGH:     { color: '#fb923c', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
  MEDIUM:   { color: '#fbbf24', bg: 'rgba(234,179,8,0.1)',  border: 'rgba(234,179,8,0.25)'  },
  LOW:      { color: '#4ade80', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)'  },
};

function AppHeader({ stats, loading, refreshing, activeView }: HeaderProps) {
  const level = stats?.threat_level ?? 'LOW';
  const meta = THREAT_META[level] ?? THREAT_META.LOW;
  const view = VIEW_LABELS[activeView] ?? VIEW_LABELS.overview;

  const ThreatIcon = level === 'CRITICAL' || level === 'HIGH'
    ? AlertTriangle
    : level === 'MEDIUM' ? Shield : CheckCircle2;

  return (
    <header className="app-header">
      {/* Page title */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
          {view.title}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(100,116,139,0.65)', marginTop: 2 }}>
          {view.sub}
        </div>
      </div>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Refresh spinner */}
        {refreshing && (
          <RefreshCw size={13} style={{ color: '#38bdf8', animation: 'spin 0.8s linear infinite' }} />
        )}

        {/* Detection Rate */}
        {!loading && stats && (
          <div className="hide-sm" style={{
            padding: '5px 12px',
            background: 'rgba(56,189,248,0.07)',
            border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: 8,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.5)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Detection</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.2 }}>
              {stats.detection_rate.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Threat Level badge */}
        {!loading && stats && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 12px',
            background: meta.bg, border: `1px solid ${meta.border}`,
            borderRadius: 8,
          }}>
            <ThreatIcon size={13} style={{ color: meta.color }} />
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.07em', lineHeight: 1 }}>THREAT</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: meta.color, lineHeight: 1.2 }}>{level}</div>
            </div>
          </div>
        )}

        {/* LIVE badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 11px',
          background: 'rgba(34,197,94,0.06)',
          border: '1px solid rgba(34,197,94,0.18)',
          borderRadius: 8,
        }}>
          <span className="live-dot" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', letterSpacing: '0.07em' }}>LIVE</span>
        </div>
      </div>

      {/* Accent line */}
      <div className="accent-line" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
    </header>
  );
}

export default AppHeader;
