import React from 'react';
import { Settings, X, RefreshCw, Info } from 'lucide-react';

interface SettingsPanelProps {
  refreshRate: number;
  onRefreshRateChange: (rate: number) => void;
  onClose: () => void;
}

const PRESETS = [
  { label: '1s', value: 1000 },
  { label: '2s', value: 2000 },
  { label: '5s', value: 5000 },
  { label: '10s', value: 10000 },
];

function SettingsPanel({ refreshRate, onRefreshRateChange, onClose }: SettingsPanelProps) {
  return (
    <div className="glass" style={{ padding: '20px 22px', border: '1px solid rgba(56,189,248,0.12)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div className="card-icon" style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.18)' }}>
          <Settings size={15} style={{ color: '#38bdf8' }} />
        </div>
        <div>
          <div className="card-title">Dashboard Settings</div>
          <div className="card-subtitle">Configure refresh and display options</div>
        </div>
        <button
          onClick={onClose}
          style={{
            marginLeft: 'auto', width: 28, height: 28, borderRadius: 7,
            background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(148,163,184,0.1)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748b', transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.1)'; e.currentTarget.style.color = '#64748b'; }}
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
        {/* Refresh Rate */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <RefreshCw size={12} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>Refresh Interval</span>
            <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 800, color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>
              {(refreshRate / 1000).toFixed(1)}s
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {PRESETS.map(p => (
              <button
                key={p.value}
                onClick={() => onRefreshRateChange(p.value)}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: 7,
                  border: `1px solid ${refreshRate === p.value ? 'rgba(56,189,248,0.35)' : 'rgba(148,163,184,0.09)'}`,
                  background: refreshRate === p.value ? 'rgba(56,189,248,0.1)' : 'rgba(10,22,40,0.5)',
                  color: refreshRate === p.value ? '#38bdf8' : 'rgba(100,116,139,0.6)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.18s', fontFamily: 'Inter, sans-serif',
                  boxShadow: refreshRate === p.value ? '0 0 10px rgba(56,189,248,0.12)' : 'none',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <input
            type="range" min="1000" max="10000" step="500" value={refreshRate}
            onChange={e => onRefreshRateChange(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#38bdf8' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.45)' }}>1s — fastest</span>
            <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.45)' }}>10s — slowest</span>
          </div>
        </div>

        {/* System Info */}
        <div style={{ background: 'rgba(10,22,40,0.5)', border: '1px solid rgba(148,163,184,0.06)', borderRadius: 9, padding: '13px 15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Info size={12} style={{ color: '#94a3b8' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>System Information</span>
          </div>
          {[
            { label: 'Backend API',  value: '127.0.0.1:8000',   color: '#38bdf8' },
            { label: 'ML Model',     value: 'Isolation Forest', color: '#c084fc' },
            { label: 'Status',       value: '● Connected',      color: '#4ade80' },
            { label: 'Log Source',   value: 'logs.txt',         color: '#94a3b8' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(148,163,184,0.04)' }}>
              <span style={{ fontSize: 11, color: 'rgba(100,116,139,0.55)' }}>{row.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: row.color, fontFamily: 'JetBrains Mono, monospace' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
