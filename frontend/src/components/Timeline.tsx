import React from 'react';
import { Zap, Clock, ShieldOff } from 'lucide-react';

interface TimelineProps { logs: string[]; }

function parseLogTimestamp(log: string): string | null {
  const m = log.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/);
  if (!m) return null;
  try {
    return new Date(m[1]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch { return null; }
}
function parseLogMessage(log: string): string {
  return log.replace(/^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]\s*/, '').trim();
}

// Try to extract a severity from common patterns
function getSeverity(msg: string): 'critical' | 'high' | 'medium' {
  const lower = msg.toLowerCase();
  if (lower.includes('critical') || lower.includes('intrusion') || lower.includes('brute')) return 'critical';
  if (lower.includes('high') || lower.includes('inject') || lower.includes('scan')) return 'high';
  return 'medium';
}

const SEV_META = {
  critical: { color: '#f87171', border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.06)', dot: '#ef4444', label: 'CRIT' },
  high:     { color: '#fb923c', border: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.06)', dot: '#f97316', label: 'HIGH' },
  medium:   { color: '#fbbf24', border: 'rgba(234,179,8,0.3)',  bg: 'rgba(234,179,8,0.06)',  dot: '#eab308', label: 'MED'  },
};

function Timeline({ logs }: TimelineProps) {
  // Show last 15 anomaly entries
  const anomalies = logs.filter(l => l.includes('ALERT')).slice(-15).reverse();

  return (
    <div className="glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="card-header">
        <div className="card-icon" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <Zap size={15} style={{ color: '#fb923c' }} />
        </div>
        <div>
          <div className="card-title">Recent Threats</div>
          <div className="card-subtitle">Latest anomaly events</div>
        </div>
        <span style={{
          marginLeft: 'auto', fontSize: 11, fontWeight: 700,
          color: '#fb923c', background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 6, padding: '2px 8px',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {anomalies.length}
        </span>
      </div>

      {/* Entries */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {anomalies.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120, gap: 8 }}>
            <ShieldOff size={22} style={{ color: 'rgba(74,222,128,0.3)' }} />
            <p style={{ color: 'rgba(100,116,139,0.5)', fontSize: 12, fontWeight: 500 }}>No threats detected</p>
          </div>
        ) : (
          <div>
            {anomalies.map((log, idx) => {
              const ts   = parseLogTimestamp(log);
              const msg  = parseLogMessage(log).replace('🚨 ', '');
              const sev  = getSeverity(msg);
              const meta = SEV_META[sev];
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 16px',
                    borderBottom: '1px solid rgba(148,163,184,0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.01)',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = meta.bg; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.01)'; }}
                >
                  {/* Severity dot */}
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: meta.dot, flexShrink: 0,
                    boxShadow: `0 0 6px ${meta.dot}`,
                  }} />

                  {/* Message */}
                  <span style={{
                    flex: 1, fontSize: 11,
                    color: 'rgba(226,232,240,0.75)',
                    fontFamily: 'JetBrains Mono, monospace',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }} title={msg}>
                    {msg}
                  </span>

                  {/* Severity label */}
                  <span className={`badge badge-${sev === 'critical' ? 'critical' : sev === 'high' ? 'high' : 'medium'}`}
                    style={{ fontSize: 9, padding: '1px 6px', flexShrink: 0 }}>
                    {meta.label}
                  </span>

                  {/* Timestamp */}
                  {ts && (
                    <span style={{
                      fontSize: 10, color: 'rgba(100,116,139,0.4)',
                      fontFamily: 'JetBrains Mono, monospace',
                      flexShrink: 0, minWidth: 64, textAlign: 'right',
                    }}>
                      {ts}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(Timeline, (prevProps, nextProps) => {
  return (
    prevProps.logs.length === nextProps.logs.length &&
    prevProps.logs[0] === nextProps.logs[0]
  );
});
