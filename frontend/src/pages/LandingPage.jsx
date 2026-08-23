import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Map, Shield, Hotel, ArrowRight, Leaf, MapPin, Building,
  Camera, CheckCircle, Award, Activity, ShieldCheck,
  Globe, Cpu, TrendingUp, Coins, Clock, ArrowUpRight, BarChart2,
  Users, RefreshCw, Zap, QrCode, Play
} from 'lucide-react';

const MUNICIPALITIES = [
  { city: 'Jaipur', state: 'Rajasthan', status: 'Normal Load', density: '35%' },
  { city: 'Agra', state: 'Uttar Pradesh', status: 'Managed Perimeter', density: '68%' },
  { city: 'Varanasi', state: 'Uttar Pradesh', status: 'Normal Load', density: '42%' },
  { city: 'Delhi', state: 'NCT Delhi', status: 'Managed Perimeter', density: '58%' },
  { city: 'Goa', state: 'Goa', status: 'Low Density', density: '25%' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const handleRoleSelect = (roleKey) => {
    navigate(`/auth?role=${roleKey}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">

      {/* ── 1. Hero Visual Banner with Immersive Photography ──────────────── */}
      <div className="relative bg-slate-950 text-white min-h-[520px] flex flex-col justify-between overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80"
            alt="Jaipur Heritage Panorama"
            className="w-full h-full object-cover opacity-35 scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        </div>

        {/* Top Header */}
        <header className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Leaf size={22} />
            </div>
            <div>
              <div className="font-extrabold text-white text-lg tracking-tight">ECO Tourism AI</div>
              <div className="text-xs text-slate-400 font-medium">Dynamic Crowd Balancing & Sustainable Tourism Engine</div>
            </div>
          </div>

        </header>

        {/* Hero Banner Main Text */}
        <div className="relative z-10 max-w-4xl mx-auto w-full px-6 py-14 text-center space-y-5 my-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Intelligent Crowd Management & Eco-Tourism Infrastructure
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            A decentralized edge AI platform that prevents heritage monument overcrowding, balances city footfall, and boosts local economies through automated real-time incentives.
          </p>
        </div>
      </div>

      {/* ── 2. Consolidated 3-Role Gateway (3 Clean Visual Image Cards) ──── */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 -mt-16 relative z-20 space-y-16">
        <div className="space-y-4">
          <div className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest font-mono bg-white/90 backdrop-blur-md inline-block px-4 py-1 rounded-full border border-slate-200 shadow-xs mx-auto block w-fit">
            Select Evaluation Portal Role
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Role 1: Tourist */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative overflow-hidden rounded-t-2xl h-52 w-full bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80"
                  alt="Citizen & Traveler"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-end p-5">
                  <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase font-mono">Citizen / Traveler</span>
                  <h3 className="text-white text-xl font-bold mt-1">Plan Trip & Stays</h3>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>Real-time crowd avoidance & smart itineraries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>Exclusive entry discounts on alternate spots</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleRoleSelect('tourist')}
                  className="w-full mt-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue as Tourist</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Role 2: Authority */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative overflow-hidden rounded-t-2xl h-52 w-full bg-slate-900">
                <img
                  src="https://i.pinimg.com/1200x/11/29/41/112941903154216475.jpg"
                  alt="Indian Police Command & Control"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://i.pinimg.com/1200x/6d/15/51/6d1551a8e80b1043bcbe850fba750c1a.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-end p-5">
                  <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase font-mono">City Police & Admin</span>
                  <h3 className="text-white text-xl font-bold mt-1">Command Center & Control</h3>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>Live AI camera crowd density telemetry</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>Real-time perimeter saturation & footfall telemetry</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleRoleSelect('authority')}
                  className="w-full mt-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Access Command Center</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Role 3: Merchant */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div className="relative overflow-hidden rounded-t-2xl h-52 w-full bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80"
                  alt="Merchant Exchange"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-end p-5">
                  <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase font-mono">Local Merchant & Hotel</span>
                  <h3 className="text-white text-xl font-bold mt-1">Shops & Restaurant Deals</h3>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>Attract redirected tourist footfall to your shop</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                    <span>Launch flash deals & track extra earnings</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleRoleSelect('merchant')}
                  className="w-full mt-3 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Merchant Portal</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── 3. Immersive Split-Screen Architecture Showcase ──────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                PLATFORM ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Edge AI Vision Meets Municipal Load-Balancing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Our technology combines browser-edge computer vision neural models with a real-time algorithmic load balancer. Video processing stays 100% private on local devices, while city servers emit automated redirection passes when capacity limits are crossed.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border-l-2 border-emerald-700 pl-3 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Zero Cloud Uploads</div>
                  <div className="text-[11px] text-slate-500 font-medium">100% video stream privacy on device.</div>
                </div>
                <div className="border-l-2 border-emerald-700 pl-3 space-y-1">
                  <div className="font-bold text-xs text-slate-900">Voluntary Diversion</div>
                  <div className="text-[11px] text-slate-500 font-medium">20% ticket discounts + partner perks.</div>
                </div>
              </div>
            </div>

            {/* Visual Mockup Card */}
            <div className="bg-slate-900 rounded-xl p-5 text-white border border-slate-800 shadow-md space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-bold text-white">LIVE CAMERA FEED</span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                  Amber Fort · 92% Rush
                </span>
              </div>

              <div className="bg-slate-950 rounded-lg p-4 text-center space-y-2 border border-slate-800">
                <div className="text-xs text-slate-400">AUTOMATED REROUTE DISPATCHED</div>
                <div className="text-sm font-bold text-emerald-400">Jaigarh Fort Pass Issued</div>
                <div className="text-[11px] text-slate-300 font-sans">20% Ticket Discount + Complimentary Refreshment</div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Latency: ~18ms</span>
                <span>Protocol: WebSocket Sync</span>
              </div>
            </div>
          </div>

          {/* Architecture Visual Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-3 p-3">
              <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80"
                  alt="Edge AI Footfall Detection"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Edge AI Footfall Detection</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">On-device neural inference analyzing visitor saturation with 100% stream privacy.</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-3 p-3">
              <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
                  alt="Smart Rerouting & Navigation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Smart Rerouting & Navigation</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Automated capacity thresholds diverting tourists to under-visited heritage sites.</div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-3 p-3">
              <div className="relative h-40 w-full rounded-lg overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80"
                  alt="Eco-Stay & Local Commerce"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">Eco-Stay & Local Commerce</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Municipal digital vouchers boosting local partner cafes, hotels, and artisan shops.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Clean 4-Step Horizontal Timeline ─────────────────────────── */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">System Workflow</div>
            <h2 className="text-xl font-bold text-slate-900">Closed-Loop Crowd Balancing Flow</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="p-3 space-y-1">
                <div className="text-xs font-bold text-emerald-800 font-mono">01. DETECT</div>
                <div className="text-sm font-bold text-slate-900">Edge Cameras</div>
                <p className="text-[11px] text-slate-500 font-medium">Cameras detect gate saturation in real-time.</p>
              </div>

              <div className="p-3 space-y-1 pt-3 md:pt-3">
                <div className="text-xs font-bold text-emerald-800 font-mono">02. ALERT</div>
                <div className="text-sm font-bold text-slate-900">Capacity Trigger</div>
                <p className="text-[11px] text-slate-500 font-medium">Crosses 85% limit and notifies admin.</p>
              </div>

              <div className="p-3 space-y-1 pt-3 md:pt-3">
                <div className="text-xs font-bold text-emerald-800 font-mono">03. REROUTE</div>
                <div className="text-sm font-bold text-slate-900">Digital Pass</div>
                <p className="text-[11px] text-slate-500 font-medium">Tourists receive alternate discount passes.</p>
              </div>

              <div className="p-3 space-y-1 pt-3 md:pt-3">
                <div className="text-xs font-bold text-emerald-800 font-mono">04. ABSORB</div>
                <div className="text-sm font-bold text-slate-900">Footfall Yield</div>
                <p className="text-[11px] text-slate-500 font-medium">Balances queues & supports local shops.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Impact Metrics & Footer Banner ────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-black text-slate-900 font-mono">35%</div>
            <div className="text-xs text-slate-600 font-medium">Queue Reduction at Peak Hours</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-emerald-800 font-mono">18 ms</div>
            <div className="text-xs text-slate-600 font-medium">On-Device AI Camera Speed</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-slate-900 font-mono">640+</div>
            <div className="text-xs text-slate-600 font-medium">Daily Diversions Absorbed</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-emerald-800 font-mono">14.2 kg</div>
            <div className="text-xs text-slate-600 font-medium">CO₂ Saved per Rerouted Visitor</div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-8 pb-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">ECO Tourism AI</span>
              <span>·</span>
              <span className="font-mono text-slate-500">v2.4 Production Build</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-600 font-semibold">
              <button onClick={() => handleRoleSelect('tourist')} className="hover:text-slate-900">Tourist Planner</button>
              <span>·</span>
              <button onClick={() => handleRoleSelect('authority')} className="hover:text-slate-900">Police & Admin</button>
              <span>·</span>
              <button onClick={() => handleRoleSelect('merchant')} className="hover:text-slate-900">Merchant Exchange</button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 font-medium">
            Government of India · Ministry of Tourism & Smart Cities Mission Evaluation Platform © 2026
          </div>
        </footer>

      </div>
    </div>
  );
}
