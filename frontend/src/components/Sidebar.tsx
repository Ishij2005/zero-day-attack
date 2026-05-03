import React from 'react';
import {
  Activity, BarChart3, Shield, Clock, Settings,
  Cpu, Wifi, AlertTriangle, ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (v: string) => void;
  stats: any;
  onSettingsClick: () => void;
}

const NAV = [
  { id: 'overview',  label: 'Overview',       icon: Activity   },
  { id: 'logs',      label: 'Log Stream',     icon: BarChart3  },
  { id: 'threats',   label: 'Threat Feed',    icon: Shield     },
  { id: 'analytics', label: 'Analytics',      icon: Cpu        },
];

function Sidebar({ activeView, onViewChange, stats, onSettingsClick }: SidebarProps) {
  const level = stats?.threat_level ?? 'LOW';
  const levelColor = { CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e' }[level] ?? '#22c55e';

  return (
    <aside className="app-sidebar">
      {/* Brand */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid rgba(148,163,184,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
            <div style={{
              position: 'absolute', inset: -2,
              background: 'linear-gradient(135deg, #06b6d4, #7c3aed)',
              borderRadius: 9, opacity: 0.35, filter: 'blur(5px)',
              animation: 'pulse 3s infinite',
            }} />
            <div style={{
              position: 'relative', width: 34, height: 34,
              background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(124,58,237,0.12))',
              border: '1px solid rgba(6,182,212,0.25)',
              borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={16} style={{ color: '#22d3ee' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em', color: '#e2e8f0' }}>
              ZeroDay
            </div>
            <div style={{ fontSize: 10, color: 'rgba(100,116,139,0.7)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Monitor
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: 10 }}>
        <div style={{ padding: '8px 16px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(71,85,105,0.8)', textTransform: 'uppercase' }}>
          Navigation
        </div>
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`nav-item${isActive ? ' active' : ''}`}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: '1px solid transparent', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              <Icon size={15} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {isActive && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div style={{ padding: '12px 14px', margin: '0 10px 10px', background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(148,163,184,0.07)', borderRadius: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(71,85,105,0.8)', textTransform: 'uppercase', marginBottom: 10 }}>
          System Status
        </div>
        {[
          { label: 'API Connection', value: 'Active', color: '#4ade80', dot: true },
          { label: 'Threat Level',   value: level,    color: levelColor, dot: false },
          { label: 'ML Model',       value: 'Online', color: '#38bdf8', dot: false },
        ].map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(148,163,184,0.04)' }}>
            <span style={{ fontSize: 11, color: 'rgba(100,116,139,0.6)', display: 'flex', alignItems: 'center', gap: 5 }}>
              {r.dot && <span className="live-dot" style={{ width: 6, height: 6 }} />}
              {r.label}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: r.color, fontFamily: 'JetBrains Mono, monospace' }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{ padding: '10px 10px 14px' }}>
        <button
          onClick={onSettingsClick}
          className="nav-item"
          style={{ width: '100%', textAlign: 'left', background: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
        >
          <Settings size={15} style={{ opacity: 0.6 }} />
          <span>Settings</span>
        </button>
        <div style={{ padding: '8px 14px 0', fontSize: 10, color: 'rgba(71,85,105,0.5)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Wifi size={9} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>127.0.0.1:8000</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
