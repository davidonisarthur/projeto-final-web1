import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchQuotes } from '../services/api.js';

const COOLDOWN = 60000;
export function useQuotes() {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastAttempt, setLastAttempt] = useState(0);
  const [now, setNow] = useState(Date.now);
  const attemptRef = useRef(0);
  const requestRef = useRef(null);

  const refresh = useCallback(async () => {
    if (requestRef.current || Date.now() - attemptRef.current < COOLDOWN) return;
    const controller = new AbortController();
    requestRef.current = controller;
    attemptRef.current = Date.now();
    setLastAttempt(attemptRef.current);
    setLoading(true);
    setError('');
    try {
      const data = await fetchQuotes(fetch, { signal: controller.signal });
      if (!controller.signal.aborted) setQuotes(data);
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure.message);
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        if (!controller.signal.aborted) setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(timer);
      requestRef.current?.abort();
      requestRef.current = null;
      attemptRef.current = 0;
    };
  }, [refresh]);

  return { quotes, loading, error, refresh, now,
    remaining: Math.max(0, Math.ceil((COOLDOWN - (now - lastAttempt)) / 1000)) };
}
