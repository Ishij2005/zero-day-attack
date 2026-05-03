import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Flame } from 'lucide-react';

interface ThreatHeatmapProps { trends: any; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div style={{
      background: 'rgba(2,8,23,0.96)', border: '1px solid rgba(148,163,184,0.12)',
      borderRadius: 8, padding: '8px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontSize: 10, color: 'rgba(148,163,184,0.5)', marginBottom: 3, fontFamily: 'JetBrains Mono, monospace' }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 800, color: '#fb923c', fontFamily: 'JetBrains Mono, monospace' }}>
        {val}
        <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(148,163,184,0.5)', marginLeft: 5 }}>threats</span>
      </p>
    </div>
  );
};

function ThreatHeatmap({ trends }: ThreatHeatmapProps) {
  if (!trends?.trends) {
    return (
      <div className="glass" style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ width: 100, height: 14 }} />
        <div className="skeleton" style={{ width: '80%', height: 120, borderRadius: 8 }} />
      </div>
    );
  }

  const maxVal  = Math.max(...trends.trends.map((d: any) => d.anomalies), 1);
  const nonZero = trends.trends.filter((d: any) => d.anomalies > 0).length;

  const getColor = (val: number) => {
    if (val === 0) return 'rgba(22,34,64,0.5)';
    const t = val / maxVal;
    if (t < 0.33) return `rgba(234,179,8,${0.45 + t * 0.5})`;
    if (t < 0.66) return `rgba(249,115,22,${0.55 + t * 0.4})`;
    return `rgba(239,68,68,${0.65 + t * 0.35})`;
  };

  return (
    <div className="glass" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div className="card-header">
        <div className="card-icon" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <Flame size={15} style={{ color: '#f87171' }} />
        </div>
        <div>
          <div className="card-title">Threat Distribution</div>
          <div className="card-subtitle">{nonZero} active time buckets</div>
        </div>
        {/* Heat scale */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 9, color: 'rgba(100,116,139,0.5)', fontWeight: 500 }}>Low</span>
          <div style={{
            width: 52, height: 5, borderRadius: 3,
            background: 'linear-gradient(90deg, rgba(234,179,8,0.7), rgba(249,115,22,0.85), rgba(239,68,68,1))',
          }} />
          <span style={{ fontSize: 9, color: 'rgba(100,116,139,0.5)', fontWeight: 500 }}>High</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: '14px 6px 10px 0', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trends.trends} margin={{ top: 4, right: 18, left: -12, bottom: 0 }} barCategoryGap="18%">
            <CartesianGrid stroke="rgba(22,34,64,0.9)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="transparent"
              tick={{ fill: 'rgba(100,116,139,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
              interval={9} tickLine={false} axisLine={false}
            />
            <YAxis
              stroke="transparent"
              tick={{ fill: 'rgba(100,116,139,0.5)', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
              tickLine={false} axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.03)' }} />
            <Bar dataKey="anomalies" radius={[3, 3, 0, 0]} animationDuration={600} maxBarSize={18}>
              {trends.trends.map((entry: any, i: number) => (
                <Cell key={i} fill={getColor(entry.anomalies)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default React.memo(ThreatHeatmap, (prevProps, nextProps) => {
  return prevProps.trends === nextProps.trends;
});
