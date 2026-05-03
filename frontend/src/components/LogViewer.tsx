import React, { useState, useRef, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle2, Search, ArrowDown } from 'lucide-react';

interface LogViewerProps { logs: string[]; loading: boolean; }
type FilterType = 'all' | 'anomaly' | 'normal';

function parseLogTime(log: string): string | null {
  const m = log.match(/\[(\d{4}-\d{2}-\d{2} (\d{2}:\d{2}:\d{2}))\]/);
  return m ? m[2] : null;
}
function parseLogMessage(log: string): string {
  return log.replace(/^\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\]\s*/, '').trim();
}

function LogViewer({ logs, loading }: LogViewerProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const anomalyCount = logs.filter(l => l.includes('ALERT')).length;
  const normalCount  = logs.filter(l => !l.includes('ALERT')).length;

  const filtered = logs.filter(log => {
    const matchFilter =
      filter === 'all' ||
      (filter === 'anomaly' ? log.includes('ALERT') : !log.includes('ALERT'));
    const matchSearch = !search || parseLogMessage(log).toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filtered.length, autoScroll]);

  const tabs = [
    { value: 'all'    as FilterType, label: 'All',       count: logs.length,   cls: 'filter-tab-active-all'     },
    { value: 'anomaly'as FilterType, label: 'Alerts',    count: anomalyCount,  cls: 'filter-tab-active-anomaly' },
    { value: 'normal' as FilterType, label: 'Normal',    count: normalCount,   cls: 'filter-tab-active-normal'  },
  ];

  return (
    <div className="glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="card-header" style={{ paddingBottom: 0, flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div className="card-icon" style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.18)' }}>
            <Activity size={15} style={{ color: '#38bdf8' }} />
          </div>
          <div>
            <div className="card-title">Live Log Stream</div>
            <div className="card-subtitle">Real-time network events</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Event count */}
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#38bdf8',
              background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.18)',
              borderRadius: 6, padding: '2px 8px', fontFamily: 'JetBrains Mono, monospace',
            }}>
              {filtered.length}
            </span>
            {/* Auto-scroll toggle */}
            <button
              onClick={() => setAutoScroll(a => !a)}
              title={autoScroll ? 'Pause scroll' : 'Resume scroll'}
              style={{
                padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                background: autoScroll ? 'rgba(34,197,94,0.08)' : 'rgba(30,41,59,0.5)',
                border: `1px solid ${autoScroll ? 'rgba(34,197,94,0.25)' : 'rgba(148,163,184,0.1)'}`,
                color: autoScroll ? '#4ade80' : '#64748b',
                fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s',
              }}
            >
              <ArrowDown size={10} />
              {autoScroll ? 'AUTO' : 'PAUSED'}
            </button>
          </div>
        </div>

        {/* Filter tabs + search */}
        <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid rgba(148,163,184,0.06)' }}>
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={filter === tab.value ? tab.cls : ''}
              style={{
                padding: '7px 13px', background: 'none', border: 'none',
                borderBottom: filter === tab.value ? undefined : '2px solid transparent',
                cursor: 'pointer', fontSize: 11, fontWeight: 600,
                color: filter === tab.value ? undefined : 'rgba(100,116,139,0.55)',
                transition: 'color 0.15s', display: 'flex', alignItems: 'center',
                gap: 5, marginBottom: -1, fontFamily: 'Inter, sans-serif',
              }}
            >
              {tab.label}
              <span style={{
                fontSize: 9, fontFamily: 'JetBrains Mono, monospace',
                background: 'rgba(148,163,184,0.08)', borderRadius: 4,
                padding: '1px 5px', color: 'rgba(148,163,184,0.5)',
              }}>{tab.count}</span>
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 0' }}>
            <Search size={11} style={{ color: 'rgba(100,116,139,0.4)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter logs…"
              style={{
                background: 'rgba(15,30,54,0.6)', border: '1px solid rgba(148,163,184,0.08)',
                borderRadius: 6, padding: '4px 9px', fontSize: 11,
                color: '#e2e8f0', outline: 'none', width: 120,
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
        </div>
      </div>

      {/* Log entries — compact rows */}
      <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace' }}>
        {loading && logs.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120, gap: 10 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              {[0,1,2].map(i => (
                <div key={i} className="skeleton" style={{ width: 7, height: 7, borderRadius: '50%', animationDelay: `${i*180}ms` }} />
              ))}
            </div>
            <p style={{ color: 'rgba(100,116,139,0.5)', fontSize: 12 }}>Connecting to stream…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100, gap: 6 }}>
            <p style={{ color: 'rgba(100,116,139,0.4)', fontSize: 12 }}>No matching events</p>
          </div>
        ) : (
          filtered.map((log, idx) => {
            const isAnomaly = log.includes('ALERT');
            const time = parseLogTime(log);
            const msg  = parseLogMessage(log);
            return (
              <div
                key={idx}
                className={isAnomaly ? 'log-anomaly' : 'log-normal'}
                style={{
                  padding: '4px 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 0.12s',
                  borderBottom: '1px solid rgba(148,163,184,0.025)',
                  minHeight: 28,
                }}
              >
                {/* Icon */}
                <div style={{ flexShrink: 0 }}>
                  {isAnomaly
                    ? <AlertCircle  size={11} style={{ color: '#f87171' }} />
                    : <CheckCircle2 size={11} style={{ color: 'rgba(74,222,128,0.5)' }} />
                  }
                </div>

                {/* Timestamp */}
                {time && (
                  <span style={{ fontSize: 10, color: 'rgba(100,116,139,0.4)', flexShrink: 0, minWidth: 64 }}>{time}</span>
                )}

                {/* Message */}
                <span style={{
                  fontSize: 11,
                  color: isAnomaly ? '#fca5a5' : 'rgba(148,163,184,0.65)',
                  flex: 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {msg || log.trim()}
                </span>

                {/* Severity tag */}
                {isAnomaly && (
                  <span className="badge badge-critical" style={{ fontSize: 9, padding: '1px 6px', flexShrink: 0 }}>
                    ALERT
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default React.memo(LogViewer, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    prevProps.logs.length === nextProps.logs.length &&
    prevProps.logs[0] === nextProps.logs[0]
  );
});
