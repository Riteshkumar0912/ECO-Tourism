import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import {
  Map, Camera, Shield, Hotel, Building, ChevronDown,
  AlertTriangle, X, Menu, Leaf, MapPin, CheckCircle,
  User, LogOut, Globe, Sliders, ArrowLeft
} from 'lucide-react';

const CITIES = ['Jaipur', 'Agra', 'Varanasi', 'Goa', 'Delhi'];

const NAV_LINKS = [
  { to: '/tourist',   icon: Map,      label: 'Itinerary Planner', roles: ['tourist'] },
  { to: '/hotels',    icon: Building, label: 'Hotel Accommodations', roles: ['tourist'] },
  { to: '/camera',    icon: Camera,   label: 'Live Crowd Camera', roles: ['authority'] },
  { to: '/authority', icon: Shield,   label: 'City Police & Admin', roles: ['authority'] },
  { to: '/hotel',     icon: Hotel,    label: 'Local Shops & Deals', roles: ['merchant'] },
];

function CityHealthPill({ monuments, city }) {
  const redCount    = monuments.filter(m => m.status === 'RED').length;
  const yellowCount = monuments.filter(m => m.status === 'YELLOW').length;

  if (redCount > 0) {
    return (
      <span className="w-full bg-red-50 text-red-800 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
          {city}: Crowd Alert
        </span>
        <span className="text-[10px] font-mono uppercase bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold">Busy</span>
      </span>
    );
  }
  if (yellowCount > 0) {
    return (
      <span className="w-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          {city}: Moderate Crowd
        </span>
        <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">Medium</span>
      </span>
    );
  }
  return null;
}

export default function Sidebar() {
  const { selectedCity, switchCity, monuments, activeAlert } = useSocket();
  const { user, openAuthModal, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [cityOpen, setCityOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cityRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setCityOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCitySelect = (city) => {
    switchCity(city);
    setCityOpen(false);
  };

  const handleTabClick = (roles) => {
    const requiredRole = roles[0];
    if (!user || user.role !== requiredRole) {
      quickDemoLogin(requiredRole);
    }
    setMobileOpen(false);
  };

  return (
    <>
      {/* ── Mobile Top Header (only visible on < md screens) ──────────────── */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white">
            <Leaf size={16} />
          </div>
          <span className="font-extrabold text-slate-900 text-sm">ECO Tourism AI</span>
        </div>
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile Backdrop Drawer ────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Main Left Vertical Sidebar ───────────────────────────────────── */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shadow-sm transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5 overflow-y-auto">


          {/* Brand Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-xs shrink-0">
              <Leaf size={20} />
            </div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">ECO Tourism AI</span>
          </div>

          {/* Destination City Dropdown */}
          <div className="space-y-1.5" ref={cityRef}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono px-1">
              Select City
            </label>
            <div className="relative">
              <button
                onClick={() => setCityOpen(v => !v)}
                className="w-full bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-900 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-emerald-700" />
                  {selectedCity}
                </span>
                <ChevronDown size={14} className={`transition-transform ${cityOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors ${
                        selectedCity === city
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Live Crowd Status Pill */}
          <div className="px-0.5">
            <CityHealthPill monuments={monuments} city={selectedCity} />
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono px-1 mb-2">
              Main Menu
            </div>
            {NAV_LINKS.map(({ to, icon: Icon, label, roles }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => handleTabClick(roles)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

        </div>

        {/* Bottom User Profile & Return to Role Selection Section */}
        <div className="border-t border-slate-200 pt-3 space-y-2.5" ref={userRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserOpen(v => !v)}
                className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate leading-tight">{user.fullName.split(' ')[0]}</div>
                    <div className="text-[9px] uppercase font-mono font-bold text-emerald-800 tracking-wider mt-0.5">{user.role}</div>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>

              {userOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 space-y-2">
                  <div className="px-3.5 py-1.5 border-b border-slate-100">
                    <div className="font-bold text-xs text-slate-900">{user.fullName}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{user.email}</div>
                  </div>

                  <div className="px-3.5 py-1">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                      Evaluation Role Switcher
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => { quickDemoLogin('tourist'); setUserOpen(false); }}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs font-semibold flex items-center justify-between ${
                          user.role === 'tourist' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Tourist</span>
                        {user.role === 'tourist' && <CheckCircle size={12} className="text-emerald-700" />}
                      </button>

                      <button
                        onClick={() => { quickDemoLogin('authority'); setUserOpen(false); }}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs font-semibold flex items-center justify-between ${
                          user.role === 'authority' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Police & Admin</span>
                        {user.role === 'authority' && <CheckCircle size={12} className="text-emerald-700" />}
                      </button>

                      <button
                        onClick={() => { quickDemoLogin('merchant'); setUserOpen(false); }}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs font-semibold flex items-center justify-between ${
                          user.role === 'merchant' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Local Merchant</span>
                        {user.role === 'merchant' && <CheckCircle size={12} className="text-emerald-700" />}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-1 px-2">
                    <button
                      onClick={() => { logout(); setUserOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 text-left"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('signin')}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <User size={14} /> Sign In
            </button>
          )}

          {/* Return to Role Selection Gateway */}
          <button
            onClick={() => { navigate('/'); setMobileOpen(false); }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <ArrowLeft size={13} /> Return to Role Selection
          </button>
        </div>
      </aside>
    </>
  );
}
