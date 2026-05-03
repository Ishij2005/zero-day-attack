import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TrendChartProps {
  trends: any;
  trendWindow: '1h' | '1d' | '1w';
  onWindowChange: (w: '1h' | '1d' | '1w') => void;
}

const WINDOWS = [
  { label: '1H', value: '1h' as const },
  { label: '1D', value: '1d' as const },
  { label: '1W', value: '1w' as const },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(2,8,23,0.96)', border: '1px solid rgba(148,163,184,0.12)',
      borderRadius: 8, padding: '8px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', marginBottom: 3, fontFamily: 'JetBrains Mono, monospace' }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 800, color: '#a855f7', fontFamily: 'JetBrains Mono, monospace' }}>
        {payload[0].value}
        <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(148,163,184,0.5)', marginLeft: 5 }}>anomalies</span>
      </p>
    </div>
  );
};

function TrendChart({ trends, trendWindow, onWindowChange }: TrendChartProps) {
  const tickInterval = trendWindow === '1h' ? 9 : trendWindow === '1d' ? 3 : 0;

  if (!trends?.trends) {
    return (
      <div className="glass" style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ width: 100, height: 14 }} />
        <div className="skeleton" style={{ width: '80%', height: 120, borderRadius: 8 }} />
      </div>
    );
  }

  return (
    <div className="glass" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div className="card-header">
        <div className="card-icon" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <TrendingUp size={15} style={{ color: '#a855f7' }} />
        </div>
        <div>
          <div className="card-title">Anomaly Trends</div>
          <div className="card-subtitle">{trends.total_anomalies?.toLocaleString()} total events</div>
        </div>
        {/* Window selector */}
        <div style={{
          marginLeft: 'auto', display: 'flex',
          background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(148,163,184,0.09)',
          borderRadius: 7, padding: 3, gap: 2,
        }}>
          {WINDOWS.map(w => (
            <button
              key={w.value}
              onClick={() => onWindowChange(w.value)}
              style={{
                padding: '4px 11px', borderRadius: 5, border: 'none',
                cursor: 'pointer', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.18s',
                background: trendWindow === w.value
                  ? 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(124,58,237,0.25))'
                  : 'transparent',
                color: trendWindow === w.value ? '#c084fc' : 'rgba(100,116,139,0.6)',
                boxShadow: trendWindow === w.value ? '0 0 10px rgba(168,85,247,0.15)' : 'none',
              }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: '14px 6px 10px 0', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trends.trends} margin={{ top: 4, right: 18, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#a855f7" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(22,34,64,0.9)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="transparent"
              tick={{ fill: 'rgba(100,116,139,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
              interval={tickInterval} tickLine={false} axisLine={false}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: 'rgba(100,116,139,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
              tickLine={false} axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(168,85,247,0.25)', strokeWidth: 1 }} />
            <Area
              type="monotone" dataKey="anomalies"
              stroke="#a855f7" strokeWidth={1.5}
              fill="url(#purpleGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#a855f7', stroke: '#020817', strokeWidth: 2 }}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default React.memo(TrendChart, (prevProps, nextProps) => {
  return (
    prevProps.trendWindow === nextProps.trendWindow &&
    prevProps.trends === nextProps.trends
  );
});
