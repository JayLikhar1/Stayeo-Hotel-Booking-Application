import { useState, useEffect, useRef, useCallback } from 'react';

const SSE_URL = `${import.meta.env.VITE_API_URL || '/api'}/analytics/stream`;

/**
 * useRealtimeAnalytics
 *
 * Connects to the backend SSE stream and returns:
 *   - liveStats   : real-time KPI snapshot (revenue, bookings, etc.)
 *   - newBooking  : latest booking notification (for toast)
 *   - isConnected : SSE connection status
 *   - lastUpdated : timestamp of last server push
 */
export const useRealtimeAnalytics = (token) => {
  const [liveStats, setLiveStats]     = useState(null);
  const [newBooking, setNewBooking]   = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const esRef        = useRef(null);
  const retryRef     = useRef(null);
  const retryCount   = useRef(0);
  const MAX_RETRIES  = 5;

  const connect = useCallback(() => {
    if (!token) return;

    // Close any existing connection
    if (esRef.current) {
      esRef.current.close();
    }

    // SSE doesn't support custom headers natively in browsers,
    // so we pass the token as a query param (backend validates it)
    const url = `${SSE_URL}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      setIsConnected(true);
      retryCount.current = 0;
      console.log('[SSE] Connected to analytics stream');
    };

    // Revenue snapshot update
    es.addEventListener('revenue_update', (e) => {
      try {
        const data = JSON.parse(e.data);
        setLiveStats(data);
        setLastUpdated(new Date(data.timestamp));
      } catch (err) {
        console.error('[SSE] Parse error:', err);
      }
    });

    // New booking notification
    es.addEventListener('new_booking', (e) => {
      try {
        const data = JSON.parse(e.data);
        setNewBooking(data);
        // Auto-clear after 8 seconds
        setTimeout(() => setNewBooking(null), 8000);
      } catch (err) {
        console.error('[SSE] Parse error:', err);
      }
    });

    // Heartbeat — just confirms connection is alive
    es.addEventListener('heartbeat', () => {
      setIsConnected(true);
    });

    es.onerror = () => {
      setIsConnected(false);
      es.close();

      // Exponential backoff retry
      if (retryCount.current < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
        retryCount.current++;
        console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${retryCount.current})`);
        retryRef.current = setTimeout(connect, delay);
      } else {
        console.warn('[SSE] Max retries reached. Giving up.');
      }
    };
  }, [token]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(retryRef.current);
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      setIsConnected(false);
    };
  }, [connect]);

  return { liveStats, newBooking, isConnected, lastUpdated };
};
