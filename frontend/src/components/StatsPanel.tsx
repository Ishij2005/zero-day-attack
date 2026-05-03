import React from 'react';
import { BarChart3, AlertTriangle, TrendingUp, Zap, TrendingDown, Minus } from 'lucide-react';

interface StatsPanelProps { stats: any; loading: boolean; }

const CARDS = [
  {
    key: 'total_logs',
    label: 'Total Events',
    icon: BarChart3,
    iconColor: '#22d3ee',
    iconBg: 'rgba(6,182,212,0.1)',
    iconBorder: 'rgba(6,182,212,0.2)',
    glow: 'glow-cyan',
    border: 'rgba(6,182,212,0.14)',
    valueBg: 'rgba(6,182,212,0.05)',
    valueColor: '#38bdf8',
    format: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v.toLocaleString(),
    rawFormat: (v: number) => v.toLocaleString(),
    sub: 'Packets processed',
  },
  {
    key: 'anomalies',
    label: 'Anomalies',
    icon: AlertTriangle,
    iconColor: '#f87171',
    iconBg: 'rgba(239,68,68,0.1)',
    iconBorder: 'rgba(239,68,68,0.2)',
    glow: 'glow-red',
    border: 'rgba(239,68,68,0.14)',
    valueBg: 'rgba(239,68,68,0.05)',
    valueColor: '#f87171',
    format: (v: number) => v.toLocaleString(),
    rawFormat: (v: number) => v.toLocaleString(),
    sub: 'Threats flagged',
  },
  {
    key: 'detection_rate',
    label: 'Detection Rate',
    icon: TrendingUp,
    iconColor: '#4ade80',
    iconBg: 'rgba(34,197,94,0.1)',
    iconBorder: 'rgba(34,197,94,0.2)',
    glow: 'glow-green',
    border: 'rgba(34,197,94,0.14)',
    valueBg: 'rgba(34,197,94,0.05)',
    valueColor: '#4ade80',
    format: (v: number) => `${v.toFixed(1)}%`,
    rawFormat: (v: number) => `${v.toFixed(2)}%`,
    sub: 'Anomaly ratio',
  },
  {
    key: 'normal',
    label: 'Clean Traffic',
    icon: Zap,
    iconColor: '#c084fc',
    iconBg: 'rgba(168,85,247,0.1)',
    iconBorder: 'rgba(168,85,247,0.2)',
    glow: 'glow-purple',
    border: 'rgba(168,85,247,0.14)',
    valueBg: 'rgba(168,85,247,0.05)',
    valueColor: '#c084fc',
    format: (v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v.toLocaleString(),
    rawFormat: (v: number) => v.toLocaleString(),
    sub: 'Safe packets',
  },
];

interface StatCardProps {
  card: typeof CARDS[0];
  value: number;
  loading: boolean;
  index: number;
}

const StatCard = React.memo(function StatCard({ card, value, loading, index }: StatCardProps) {
  const Icon = card.icon;

  return (
    <div
      className={`glass-card ${card.glow}`}
      style={{
        padding: '20px 22px',
        border: `1px solid ${card.border}`,
        background: `linear-gradient(135deg, ${card.valueBg}, rgba(10,22,40,0.8))`,
      }}
    >
      {/* Top row: icon + indicator dot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 9,
          background: card.iconBg, border: `1px solid ${card.iconBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} style={{ color: card.iconColor }} />
        </div>
        <div style={{
          fontSize: 10, fontWeight: 700,
          color: card.iconColor,
          background: card.iconBg, border: `1px solid ${card.iconBorder}`,
          padding: '2px 8px', borderRadius: 99, letterSpacing: '0.06em',
          opacity: loading ? 0.4 : 1, transition: 'opacity 0.3s',
        }}>
          {loading ? '···' : 'LIVE'}
        </div>
      </div>

      {/* Value */}
      {loading ? (
        <div className="skeleton" style={{ height: 36, width: '60%', marginBottom: 10 }} />
      ) : (
        <div
          style={{
            fontSize: 32, fontWeight: 800, color: card.valueColor,
            lineHeight: 1, letterSpacing: '-0.03em',
            fontFamily: 'Inter, sans-serif', marginBottom: 6,
            minHeight: 40,
          }}
          title={card.rawFormat(value)}
        >
          {card.format(value)}
        </div>
      )}

      {/* Label & sublabel */}
      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(226,232,240,0.85)', marginBottom: 2 }}>
        {card.label}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(100,116,139,0.55)' }}>
        {card.sub}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value && prevProps.loading === nextProps.loading;
});

function StatsPanel({ stats, loading }: StatsPanelProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
      {CARDS.map((card, i) => (
        <StatCard 
          key={card.key} 
          card={card} 
          value={stats?.[card.key] ?? 0} 
          loading={loading} 
          index={i} 
        />
      ))}
    </div>
  );
}

export default React.memo(StatsPanel, (prevProps, nextProps) => {
  if (prevProps.loading !== nextProps.loading) return false;
  
  // Only re-render if one of the stat values changed
  return CARDS.every(card => prevProps.stats?.[card.key] === nextProps.stats?.[card.key]);
});
