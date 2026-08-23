import { useEffect, useRef, useState, useCallback } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { useSocket } from '../context/SocketContext';
import {
  Camera, Video, Users, Wifi, AlertTriangle, RefreshCw,
  Play, Square, Sliders, ChevronDown, CheckCircle, Activity, Clock, Terminal, Shield, Eye
} from 'lucide-react';

const MONUMENTS = [
  { name: 'Red Fort',             city: 'Delhi',     maxCapacity: 3500 },
  { name: 'Safdarjung Tomb',      city: 'Delhi',     maxCapacity: 1500 },
  { name: 'Amber Fort',           city: 'Jaipur',    maxCapacity: 1000 },
  { name: 'Jaigarh Fort',         city: 'Jaipur',    maxCapacity: 1200 },
  { name: 'Taj Mahal',            city: 'Agra',      maxCapacity: 2500 },
  { name: 'Mehtab Bagh',          city: 'Agra',      maxCapacity: 1500 },
  { name: 'Dashashwamedh Ghat',   city: 'Varanasi',  maxCapacity: 3000 },
  { name: 'Assi Ghat',            city: 'Varanasi',  maxCapacity: 2000 },
  { name: 'Baga Beach',           city: 'Goa',       maxCapacity: 2000 },
  { name: 'Morjim Beach',         city: 'Goa',       maxCapacity: 1500 },
  { name: 'Gateway of India',     city: 'Mumbai',    maxCapacity: 3500 },
  { name: 'Kanheri Caves',        city: 'Mumbai',    maxCapacity: 1200 },
  { name: 'City Palace Udaipur',  city: 'Udaipur',   maxCapacity: 2500 },
  { name: 'Sajjangarh Palace',    city: 'Udaipur',   maxCapacity: 1000 },
  { name: 'Golden Temple Gate',   city: 'Amritsar',  maxCapacity: 4500 },
  { name: 'Gobindgarh Fort',      city: 'Amritsar',  maxCapacity: 1500 },
  { name: 'Victoria Memorial',    city: 'Kolkata',   maxCapacity: 3000 },
  { name: 'Indian Museum',        city: 'Kolkata',   maxCapacity: 1800 },
  { name: 'Lalbagh Glass House',  city: 'Bengaluru', maxCapacity: 2500 },
  { name: 'Cubbon Park',          city: 'Bengaluru', maxCapacity: 3000 },
];

function useFpsCounter() {
  const fpsRef   = useRef(0);
  const frameRef = useRef(0);
  const lastRef  = useRef(performance.now());
  const [fps, setFps] = useState(0);

  const tick = useCallback(() => {
    frameRef.current++;
    const now = performance.now();
    if (now - lastRef.current >= 1000) {
      fpsRef.current = frameRef.current;
      setFps(frameRef.current);
      frameRef.current = 0;
      lastRef.current  = now;
    }
  }, []);

  return { fps, tick };
}

export default function CameraMonitor() {
  const { updateMonumentCount, isConnected } = useSocket();

  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const modelRef   = useRef(null);
  const streamRef  = useRef(null);
  const rafRef     = useRef(null);

  const [modelLoading, setModelLoading] = useState(true);
  const [modelLoaded,  setModelLoaded]  = useState(false);
  const [modelError,   setModelError]   = useState(null);
  const [isRunning,    setIsRunning]    = useState(false);
  const [sourceMode,   setSourceMode]   = useState('webcam');
  const [selectedMon,  setSelectedMon]  = useState(MONUMENTS[0]);
  const [threshold,    setThreshold]    = useState(1);
  const [detectedCount, setDetectedCount] = useState(0);
  const [simulatedOvercrowd, setSimulatedOvercrowd] = useState(false);
  const [monDropdown,  setMonDropdown]  = useState(false);
  const [lastEmitted,  setLastEmitted]  = useState(null);
  const [telemetryLogs, setTelemetryLogs] = useState([]);
  const { fps, tick } = useFpsCounter();

  const activeCount = simulatedOvercrowd ? Math.max(detectedCount, 2) : detectedCount;

  const currentLoadPercent = threshold > 0
    ? Math.min(100, Math.round((activeCount / threshold) * 100))
    : 0;

  const isOvercrowded = currentLoadPercent >= 85 || (threshold > 0 && activeCount >= threshold);

  const statusInfo = isOvercrowded
    ? { status: 'RED',    label: 'CROWD ALERT: BUSY', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', pct: currentLoadPercent }
    : currentLoadPercent >= 60
    ? { status: 'YELLOW', label: 'MODERATE CROWD',     color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', pct: currentLoadPercent }
    : { status: 'GREEN',  label: 'Safe / Not Crowded', color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', pct: currentLoadPercent };

  const logTelemetry = useCallback((msg) => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setTelemetryLogs(prev => [`[${timeStr}] ${msg}`, ...prev].slice(0, 10));
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadModel() {
      try {
        setModelLoading(true);
        setModelError(null);
        const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
        if (isMounted) {
          modelRef.current = loadedModel;
          setModelLoaded(true);
          setModelLoading(false);
          logTelemetry('AI person detection model loaded successfully.');
        }
      } catch (err) {
        if (isMounted) {
          setModelError('Failed to load AI model weights.');
          setModelLoading(false);
        }
      }
    }
    loadModel();
    return () => { isMounted = false; };
  }, [logTelemetry]);

  const detectFrame = useCallback(async () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    const model  = modelRef.current;

    if (!video || !canvas || !model || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    tick();

    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;

    try {
      const predictions = await model.detect(video);
      const persons = predictions.filter(
        p => p.class === 'person' && p.score >= 0.40
      );
      setDetectedCount(persons.length);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      persons.forEach((person) => {
        const [x, y, width, height] = person.bbox;
        ctx.strokeStyle = '#047857';
        ctx.lineWidth   = 2;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = '#047857';
        const labelText = `Person ${Math.round(person.score * 100)}%`;
        ctx.font = '11px sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        ctx.fillRect(x, y > 18 ? y - 18 : y, textWidth + 8, 18);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, x + 4, y > 18 ? y - 4 : y + 14);
      });
    } catch (e) {
      console.warn('Detection error:', e);
    }

    if (isRunning) {
      rafRef.current = requestAnimationFrame(detectFrame);
    }
  }, [isRunning, tick]);

  const emitCountUpdate = useCallback((countVal) => {
    const calcPct = threshold > 0 ? Math.min(100, Math.round((countVal / threshold) * 100)) : 35;
    const calcStat = calcPct >= 85 ? 'RED' : calcPct >= 60 ? 'YELLOW' : 'GREEN';

    updateMonumentCount({
      monumentName: selectedMon.name,
      cityName:     selectedMon.city,
      count:        countVal,
      loadPercent:  calcPct,
      status:       calcStat,
      threshold,
      timestamp:    new Date().toISOString()
    });

    setLastEmitted(new Date().toLocaleTimeString());
    logTelemetry(`Count updated for ${selectedMon.name}: ${countVal} detected (${calcPct}% load).`);
  }, [selectedMon, threshold, updateMonumentCount, logTelemetry]);

  useEffect(() => {
    if (isRunning) {
      emitCountUpdate(activeCount);
    }
  }, [activeCount, isRunning, emitCountUpdate]);

  const startCamera = async () => {
    try {
      if (sourceMode === 'webcam') {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      }
      setIsRunning(true);
      logTelemetry('Live camera started.');
    } catch (err) {
      alert('Camera Permission Error: ' + err.message);
    }
  };

  const stopCamera = () => {
    setIsRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setDetectedCount(0);
    logTelemetry('Camera stopped.');
  };

  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(detectFrame);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning, detectFrame]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-md">
                LIVE CROWD CAMERA
              </span>
              <span className="text-xs text-slate-500 font-mono">Smart Vision System</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Live Crowd Monitoring Camera
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-0.5">
              Real-time AI camera tracking visitor crowd density and suggesting alternative spots when full.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimulatedOvercrowd(v => !v)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                simulatedOvercrowd
                  ? 'bg-red-700 border-red-700 text-white shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {simulatedOvercrowd ? 'Simulated Overcrowd Active' : 'Test Overcrowd Alert'}
            </button>
          </div>
        </div>

        {/* ── Operational Telemetry Metrics Cards ────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">AI Model</div>
            <div className="text-sm font-bold text-slate-900">Person Detection AI</div>
            <div className="text-[10px] text-emerald-800 font-bold">TensorFlow.js Engine</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Speed</div>
            <div className="text-sm font-bold text-slate-900 font-mono">Fast (~18 ms)</div>
            <div className="text-[10px] text-slate-500 font-semibold">Frame Rate: {fps} FPS</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Crowd Alert Limit</div>
            <div className="text-sm font-bold text-slate-900 font-mono">{threshold} Visitor Limit</div>
            <div className="text-[10px] text-slate-500 font-semibold">Capacity Threshold: 85%</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1 shadow-sm">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Live Status</div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-600' : 'bg-red-600'}`} />
              {isConnected ? 'Active & Connected' : 'Offline Mode'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Last Sync: {lastEmitted || 'Pending'}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Video Container (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
              <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">

                <video
                  ref={videoRef}
                  playsInline
                  muted
                  style={{ transform: 'none' }}
                  className={`w-full h-full object-cover ${isRunning ? 'block' : 'hidden'}`}
                />

                <canvas
                  ref={canvasRef}
                  style={{ transform: 'none' }}
                  className={`absolute inset-0 w-full h-full pointer-events-none ${isRunning ? 'block' : 'hidden'}`}
                />

                {!isRunning && (
                  <div className="text-center p-8 space-y-3">
                    <Video size={48} className="text-slate-600 mx-auto" />
                    <div className="text-sm font-bold text-slate-300">Live Camera Feed Offline</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Click "Start Live Camera" below to start detecting people.
                    </p>
                  </div>
                )}

                {/* Status Badges Overlay */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="bg-slate-900/90 text-white border border-slate-700 px-3 py-1 rounded-md text-xs font-bold backdrop-blur-md font-mono">
                    Detected: {activeCount} Visitors
                  </span>
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border backdrop-blur-md ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                    {statusInfo.label} ({statusInfo.pct}%)
                  </span>
                </div>

                {/* Bottom Left LIVE Badge */}
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="bg-red-700 text-white px-3 py-1 rounded-md text-xs font-bold shadow-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE CAMERA FEED
                  </span>
                </div>

                {/* Bottom Right Controls */}
                <div className="absolute bottom-4 right-4 z-30">
                  {!isRunning ? (
                    <button
                      onClick={startCamera}
                      disabled={modelLoading}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Play size={14} /> Start Live Camera
                    </button>
                  ) : (
                    <button
                      onClick={stopCamera}
                      className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Square size={14} /> Stop Camera
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Settings & Activity Log */}
          <div className="space-y-4">
            {/* Target Location Controls */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sliders size={14} className="text-emerald-700" /> Camera Settings
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600">Select Place</label>
                <div className="relative">
                  <button
                    onClick={() => setMonDropdown(v => !v)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-left text-xs font-bold text-slate-900 flex items-center justify-between"
                  >
                    <span>{selectedMon.name} ({selectedMon.city})</span>
                    <ChevronDown size={14} />
                  </button>
                  {monDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                      {MONUMENTS.map(m => (
                        <button
                          key={m.name}
                          onClick={() => { setSelectedMon(m); setMonDropdown(false); }}
                          className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          {m.name} ({m.city})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Alert Me If People Exceed</span>
                  <span className="font-mono font-bold text-slate-900">{threshold} Visitors</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Live Camera Activity Log */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-mono">
                <Terminal size={14} className="text-emerald-700" /> Live Camera Activity Log
              </h3>
              <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-[11px] font-mono space-y-1 max-h-48 overflow-y-auto">
                {telemetryLogs.length === 0 ? (
                  <div className="text-slate-500 italic">No camera events logged yet.</div>
                ) : (
                  telemetryLogs.map((log, i) => (
                    <div key={i} className="leading-snug">{log}</div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
