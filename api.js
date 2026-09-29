import { useEffect, useRef, useState, useCallback } from "react";
import { MOCK_DASHBOARD } from "./mock.js";

// Empty base => relative "/api/..." which the Vite dev server proxies to localhost:5000.
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const POLL_MS = Number(import.meta.env.VITE_POLL_MS || 2000);

async function getJSON(path, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...opts, signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export function fetchDashboard() {
  return getJSON("/api/dashboard");
}

export function fetchGraph(metric, range) {
  return getJSON(`/api/graphs?metric=${encodeURIComponent(metric)}&range=${encodeURIComponent(range)}`);
}

export function sendControl(action) {
  return getJSON("/api/control", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
}

/**
 * Polls /api/dashboard every POLL_MS.
 * Returns { data, live, error, refresh }.
 *  - live=true  : data came from the backend
 *  - live=false : backend unreachable, data is MOCK_DASHBOARD (UI still renders)
 */
export function useDashboard() {
  const [data, setData] = useState(MOCK_DASHBOARD);
  const [live, setLive] = useState(false);
  const [error, setError] = useState(null);
  const inflight = useRef(false);

  const refresh = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    try {
      const json = await fetchDashboard();
      setData((prev) => ({ ...prev, ...json }));
      setLive(true);
      setError(null);
    } catch (e) {
      setLive(false);
      setError(e.message || String(e));
    } finally {
      inflight.current = false;
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { data, live, error, refresh };
}
