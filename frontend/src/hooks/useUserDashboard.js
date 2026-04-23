import { useState, useEffect, useRef, useCallback } from 'react';
import { dashboardAPI } from '../services/api';

const SSE_URL = `${import.meta.env.VITE_API_URL || '/api'}/user-stream`;

/**
 * useUserDashboard
 *
 * Combines:
 *  1. Initial HTTP fetch for full dashboard data
 *  2. SSE stream that pushes real-time updates whenever anything changes
 *     (payment, booking, wallet, loyalty, documents, preferences)
 *
 * Returns:
 *  - data         : full dashboard snapshot (merged HTTP + SSE)
 *  - isLoading    : true only on first load
 *  - isConnected  : SSE live status
 *  - lastUpdated  : Date of last SSE push
 *  - refresh      : manually re-fetch full snapshot
 */
export const useUserDashboard = (token) => {
  const [data, setData]             = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [isConnected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const esRef      = useRef(null);
  const retryRef   = useRef(null);
  const retryCount = useRef(0);
  const MAX_RETRY  = 5;

  // ── Initial HTTP fetch ─────────────────────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const res = await dashboardAPI.get();
      setData(res.data.dashboard);
    } catch (e) {
      console.error('[Dashboard] HTTP fetch error:', e.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── SSE connection ─────────────────────────────────────────────────
  const connect = useCallback(() => {
    if (!token) return;
    if (esRef.current) esRef.current.close();

    const url = `${SSE_URL}?token=${encodeURIComponent(token)}`;
    const es  = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      retryCount.current = 0;
    };

    // Full dashboard snapshot pushed from server
    es.addEventListener('dashboard_update', (e) => {
      try {
        const incoming = JSON.parse(e.data);
        setData(prev => prev ? { ...prev, ...incoming } : incoming);
        setLastUpdated(new Date(incoming.timestamp));
      } catch (err) {
        console.error('[UserSSE] parse error:', err);
      }
    });

    es.addEventListener('heartbeat', () => setConnected(true));

    es.onerror = () => {
      setConnected(false);
      es.close();
      if (retryCount.current < MAX_RETRY) {
        const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
        retryCount.current++;
        retryRef.current = setTimeout(connect, delay);
      }
    };
  }, [token]);

  // ── Mount / unmount ────────────────────────────────────────────────
  useEffect(() => {
    refresh();          // initial HTTP load
    connect();          // open SSE stream
    return () => {
      clearTimeout(retryRef.current);
      if (esRef.current) { esRef.current.close(); esRef.current = null; }
      setConnected(false);
    };
  }, [refresh, connect]);

  return { data, isLoading, isConnected, lastUpdated, refresh };
};
