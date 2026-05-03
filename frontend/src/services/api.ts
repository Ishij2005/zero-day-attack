const BASE_URL = 'http://127.0.0.1:8000';

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/api/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

// BUG 2 FIX: Use 'offset' (not 'page') to match backend API
export async function fetchLogs(offset = 0, limit = 100, filter = 'all') {
  const res = await fetch(`${BASE_URL}/api/logs?offset=${offset}&limit=${limit}&filter=${filter}`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

// BUG 3 FIX: Use 'window' param with correct values '1h'|'1d'|'1w' (not 'timeframe'/'hour')
export async function fetchTrends(window: '1h' | '1d' | '1w' = '1h') {
  const res = await fetch(`${BASE_URL}/api/trends?window=${window}`);
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
}
