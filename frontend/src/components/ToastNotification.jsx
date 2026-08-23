import { useEffect, useState, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { X, AlertTriangle, CheckCircle, Megaphone } from 'lucide-react';

function playBeep(type = 'alert') {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'alert') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'warning') {
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Fail silently
  }
}

const TOAST_CONFIGS = {
  red: {
    icon:       AlertTriangle,
    bg:         'bg-red-950/95 border-red-500/50',
    iconColor:  'text-red-400',
    titleColor: 'text-red-300',
    badge:      'bg-red-500/20 text-red-400 border-red-500/40',
    badgeText:  'CROWD DENSITY ALERT',
    sound:      'alert',
  },
  amber: {
    icon:       Megaphone,
    bg:         'bg-amber-950/95 border-amber-500/50',
    iconColor:  'text-amber-400',
    titleColor: 'text-amber-300',
    badge:      'bg-amber-500/20 text-amber-400 border-amber-500/40',
    badgeText:  'AUTHORITY BROADCAST',
    sound:      'warning',
  },
  success: {
    icon:       CheckCircle,
    bg:         'bg-emerald-950/95 border-emerald-500/50',
    iconColor:  'text-emerald-400',
    titleColor: 'text-emerald-300',
    badge:      'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    badgeText:  'VOUCHER CLAIMED',
    sound:      'success',
  },
};

function Toast({ id, type, title, message, onDismiss }) {
  const cfg = TOAST_CONFIGS[type] || TOAST_CONFIGS.amber;
  const Icon = cfg.icon;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      className={`w-full max-w-sm backdrop-blur-md border rounded-xl shadow-lg
        overflow-hidden transition-all duration-300 ease-out
        ${cfg.bg}
        ${visible
          ? 'opacity-100 translate-x-0 scale-100'
          : 'opacity-0 translate-x-8 scale-95'
        }`}
    >
      <div className="h-0.5 bg-slate-800 overflow-hidden">
        <div
          className={`h-full ${type === 'red' ? 'bg-red-500' : type === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}
            animate-[shrink_5s_linear_forwards]`}
          style={{ animation: 'shrink 5s linear forwards' }}
        />
      </div>

      <div className="p-4 flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
          ${type === 'red' ? 'bg-red-500/20' : type === 'success' ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
          <Icon size={16} className={cfg.iconColor} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
              {cfg.badgeText}
            </span>
          </div>
          <div className={`text-xs font-bold leading-snug ${cfg.titleColor}`}>{title}</div>
          {message && <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-medium">{message}</div>}
        </div>

        <button onClick={dismiss} className="text-slate-400 hover:text-white transition-colors shrink-0">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

let _toastId = 0;

export default function ToastNotification() {
  const { activeAlert, manualBanner } = useSocket();
  const [toasts, setToasts] = useState([]);
  const seenAlerts  = useRef(new Set());
  const seenBanners = useRef(new Set());

  const addToast = useCallback((type, title, message) => {
    const id = ++_toastId;
    playBeep(type === 'red' ? 'alert' : type === 'success' ? 'success' : 'warning');
    setToasts(prev => [{ id, type, title, message }, ...prev].slice(0, 5));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5500);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    if (!activeAlert) return;
    const key = `${activeAlert.crowdedSpot?.name}-${activeAlert.crowdedSpot?.loadPercent}`;
    if (seenAlerts.current.has(key)) return;
    seenAlerts.current.add(key);

    addToast(
      'red',
      `${activeAlert.crowdedSpot?.name} is at ${activeAlert.crowdedSpot?.loadPercent}% capacity`,
      activeAlert.alternativeSpot
        ? `Redirecting to ${activeAlert.alternativeSpot.name} · ${activeAlert.activeCoupon?.code || 'Perk available'}`
        : 'Automated rerouting has been activated for this area.'
    );
  }, [activeAlert, addToast]);

  useEffect(() => {
    if (!manualBanner) return;
    const key = `${manualBanner.title}-${manualBanner.message}`;
    if (seenBanners.current.has(key)) return;
    seenBanners.current.add(key);

    addToast(
      'amber',
      manualBanner.title,
      `${manualBanner.message}${manualBanner.targetCity !== 'ALL' ? ` — ${manualBanner.targetCity}` : ''}`
    );
  }, [manualBanner, addToast]);

  useEffect(() => {
    window.__addSuccessToast = (title, message) => addToast('success', title, message);
    return () => { delete window.__addSuccessToast; };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>

      <div className="fixed top-20 right-4 z-[60] flex flex-col gap-3 pointer-events-none"
        style={{ maxWidth: 'min(calc(100vw - 2rem), 22rem)' }}>
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </>
  );
}
