import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

// ─── Context ─────────────────────────────────────────────────────────────────

const SocketContext = createContext(null);

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within <SocketProvider>');
  return ctx;
};

// ─── Provider ────────────────────────────────────────────────────────────────

const BACKEND_URL = 'http://localhost:5000';
const DEFAULT_CITY = 'Jaipur';

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

  const [isConnected, setIsConnected]   = useState(false);
  const [monuments,   setMonuments]     = useState([]);
  const [activeAlert, setActiveAlert]   = useState(null);
  const [manualBanner, setManualBanner] = useState(null);
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [activeConnections, setActiveConnections] = useState(0);
  const [latestRedemption, setLatestRedemption] = useState(null);

  // ── Fetch initial monument data for selected city ─────────────────────────
  const fetchMonuments = useCallback(async (city) => {
    try {
      const url = city ? `/api/monuments?city=${encodeURIComponent(city)}` : '/api/monuments';
      const res  = await fetch(url);
      const json = await res.json();
      if (json.success) setMonuments(json.data);
    } catch (err) {
      console.warn('[SocketContext] Failed to fetch monuments:', err.message);
    }
  }, []);

  // ── Socket setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });

    socketRef.current = socket;

    // ── Core lifecycle ────────────────────────────────────────────────────
    socket.on('connect', () => {
      console.log(`✅ [Socket] Connected — id: ${socket.id}`);
      setIsConnected(true);
      socket.emit('JOIN_CITY_ROOM', DEFAULT_CITY);
    });

    socket.on('disconnect', (reason) => {
      console.warn(`⚠️ [Socket] Disconnected: ${reason}`);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error(`❌ [Socket] Connection error: ${err.message}`);
      setIsConnected(false);
    });

    // ── Crowd status change ───────────────────────────────────────────────
    socket.on('CROWD_STATUS_CHANGED', (payload) => {
      console.log('[Socket] CROWD_STATUS_CHANGED →', payload.name, payload.status);
      setMonuments((prev) => {
        const idx = prev.findIndex(
          (m) => m._id === payload.monumentId || m.name.toLowerCase() === payload.name?.toLowerCase()
        );
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          currentCount: payload.currentCount,
          maxCapacity:  payload.maxCapacity,
          status:       payload.status,
          crowdLoadPercent: payload.loadPercent,
        };
        return updated;
      });
    });

    // ── Crowd alert (RED breach) ──────────────────────────────────────────
    socket.on('TRIGGER_CROWD_ALERT', (payload) => {
      console.warn('[Socket] TRIGGER_CROWD_ALERT →', payload);
      setActiveAlert(payload);
      // Auto-dismiss after 30 seconds
      setTimeout(() => setActiveAlert(null), 30_000);
    });

    // ── Manual diversion banner ───────────────────────────────────────────
    socket.on('MANUAL_DIVERSION_BANNER', (payload) => {
      console.log('[Socket] MANUAL_DIVERSION_BANNER →', payload);
      setManualBanner(payload);
      setTimeout(() => setManualBanner(null), 20_000);
    });

    // ── Client count ─────────────────────────────────────────────────────
    socket.on('CLIENT_COUNT_UPDATE', ({ activeConnections: count }) => {
      setActiveConnections(count);
    });

    // ── Voucher redeemed at gate ──────────────────────────────────────────
    socket.on('VOUCHER_REDEEMED_AT_GATE', (payload) => {
      console.log('🎟️ [Socket] VOUCHER_REDEEMED_AT_GATE →', payload);
      setLatestRedemption(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ── Fetch monuments when city changes ────────────────────────────────────
  useEffect(() => {
    fetchMonuments(selectedCity);
  }, [selectedCity, fetchMonuments]);

  // ── Helper: emit crowd count update ──────────────────────────────────────
  const updateMonumentCount = useCallback((monumentName, count) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('UPDATE_CROWD_COUNT', { monumentName, newCount: count });
  }, []);

  // ── Helper: switch city ───────────────────────────────────────────────────
  const switchCity = useCallback((city) => {
    setSelectedCity(city);
    if (socketRef.current?.connected) {
      socketRef.current.emit('JOIN_CITY_ROOM', city);
    }
  }, []);

  // ── Helper: dismiss active alert ─────────────────────────────────────────
  const dismissAlert = useCallback(() => setActiveAlert(null), []);
  const dismissBanner = useCallback(() => setManualBanner(null), []);

  // ── Helper: broadcast manual diversion (authority use) ───────────────────
  const broadcastDiversion = useCallback((payload) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('BROADCAST_MANUAL_DIVERSION', payload);
  }, []);

  // ── Helper: redeem voucher at gate (staff / merchant scanner) ────────────
  const redeemVoucherAtGate = useCallback((payload) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('REDEEM_VOUCHER_AT_GATE', payload);
    }
  }, []);

  const value = {
    isConnected,
    monuments,
    activeAlert,
    manualBanner,
    selectedCity,
    activeConnections,
    latestRedemption,
    updateMonumentCount,
    switchCity,
    dismissAlert,
    dismissBanner,
    broadcastDiversion,
    redeemVoucherAtGate,
    refetchMonuments: fetchMonuments,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
