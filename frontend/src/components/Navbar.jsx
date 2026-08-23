import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import {
  Map, Camera, Shield, Hotel, Building, ChevronDown,
  Wifi, WifiOff, AlertTriangle, X, Menu, Leaf, MapPin, Ticket, CheckCircle,
  User, LogOut, Lock, Sparkles, Globe, Eye
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
      <span className="bg-red-50 text-red-800 border border-red-200 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
        {city}: Crowd Alert: Busy
      </span>
    );
  }
  if (yellowCount > 0) {
    return (
      <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        {city}: Moderate Crowd
      </span>
    );
  }
  return (
    <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
      {city}: City Crowd: Normal
    </span>
  );
}

export default function Navbar() {
  const { selectedCity, switchCity, monuments, activeAlert, manualBanner, dismissAlert, dismissBanner } = useSocket();
  const { user, openAuthModal, logout, quickDemoLogin } = useAuth();

  const [cityOpen,   setCityOpen]   = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const [lang,       setLang]       = useState('EN');
  const [textSize,   setTextSize]   = useState('normal');

  const cityDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setCityOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (activeAlert) setAlertShown(true);
  }, [activeAlert]);

  const handleCitySelect = (city) => {
    switchCity(city);
    setCityOpen(false);
  };

  const handleTabClick = (roles) => {
    const requiredRole = roles[0];
    if (!user || user.role !== requiredRole) {
      quickDemoLogin(requiredRole);
    }
  };

  return (
    <>

      {/* ── 2. Manual Diversion Banner ───────────────────────────── */}
      {manualBanner && (
        <div className={`w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold z-50 text-white
          ${manualBanner.severity === 'HIGH' ? 'bg-red-700' :
            manualBanner.severity === 'WARNING' ? 'bg-amber-600' : 'bg-emerald-800'}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>OFFICIAL BROADCAST:</span>
            <span>{manualBanner.title} — {manualBanner.message}</span>
            {manualBanner.targetCity !== 'ALL' && (
              <span className="opacity-80 font-mono">— [{manualBanner.targetCity}]</span>
            )}
          </div>
          <button onClick={dismissBanner} className="hover:opacity-70 transition-opacity">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── 3. Crowd Alert Toast ─────────────────────────────────── */}
      {activeAlert && alertShown && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full bg-white border border-red-200 rounded-xl p-4 shadow-lg animate-in slide-in-from-right">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={15} className="text-red-700" />
                <span className="text-red-700 font-bold text-xs uppercase tracking-wider">Crowd Alert</span>
                <span className="bg-red-50 text-red-800 border border-red-200 text-[10px] px-2 py-0.5 rounded-md font-mono font-bold">LIVE</span>
              </div>
              <p className="text-slate-800 text-xs font-medium">
                {activeAlert.crowdedSpot?.name} is at&nbsp;
                <span className="text-red-700 font-bold">{activeAlert.crowdedSpot?.loadPercent}%</span> capacity limit
              </p>
              {activeAlert.alternativeSpot && (
                <p className="text-emerald-800 text-xs mt-1 font-medium">
                  Reroute to {activeAlert.alternativeSpot.name}
                  {activeAlert.alternativeSpot.distanceKm && ` (${activeAlert.alternativeSpot.distanceKm} km)`}
                </p>
              )}
            </div>
            <button onClick={() => { setAlertShown(false); dismissAlert(); }}
              className="text-slate-400 hover:text-slate-600 shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── 4. Main Navbar ───────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Institutional Brand Lockup */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white shadow-xs">
              <Leaf size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">ECO Tourism AI</span>
              <span className="text-[10px] text-slate-500 font-medium">Dynamic Crowd Balancing & Sustainable Tourism Engine</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, icon: Icon, label, roles }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => handleTabClick(roles)}
                className={({ isActive }) =>
                  `nav-link relative ${isActive ? 'nav-link-active' : ''}`
                }
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side: health pill + city selector + User Auth Profile */}
          <div className="flex items-center gap-3">
            {/* Health Pill — hidden on mobile */}
            <div className="hidden lg:block">
              <CityHealthPill monuments={monuments} city={selectedCity} />
            </div>

            {/* City Selector */}
            <div className="relative" ref={cityDropdownRef}>
              <button
                onClick={() => setCityOpen(v => !v)}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/70
                           border border-emerald-200 rounded-lg px-3 py-2
                           text-xs font-bold text-emerald-900 transition-colors"
              >
                <MapPin size={13} className="text-emerald-700" />
                {selectedCity}
                <ChevronDown size={14} className={`transition-transform ${cityOpen ? 'rotate-180' : ''}`} />
              </button>

              {cityOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200
                                rounded-xl shadow-lg py-1 z-50">
                  {CITIES.map(city => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors
                        ${selectedCity === city
                          ? 'text-emerald-800 bg-emerald-50 font-bold'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium'
                        }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── User Auth Profile / Demo Role Switcher ─────────────────── */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserOpen(v => !v)}
                  className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-700"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-bold text-slate-900 leading-tight text-xs truncate max-w-[110px]">{user.fullName.split(' ')[0]}</span>
                    <span className="text-[9px] uppercase font-mono font-bold text-emerald-800 tracking-wider">{user.role}</span>
                  </div>
                  <ChevronDown size={13} className={`text-slate-500 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 space-y-2">
                    <div className="px-4 py-2 border-b border-slate-100 space-y-0.5">
                      <div className="font-bold text-xs text-slate-900">{user.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                      <div className="mt-1 inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-[9px] uppercase font-bold font-mono px-2 py-0.5 rounded-md">
                        Role: {user.role}
                      </div>
                    </div>

                    {/* Judge Demo Fast Role Switcher */}
                    <div className="px-4 py-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                        Evaluation Role Switcher
                      </div>
                      <div className="space-y-1">
                        <button
                          onClick={() => { quickDemoLogin('tourist'); setUserOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                            user.role === 'tourist' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Tourist / Citizen</span>
                          {user.role === 'tourist' && <CheckCircle size={12} className="text-emerald-700" />}
                        </button>

                        <button
                          onClick={() => { quickDemoLogin('authority'); setUserOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                            user.role === 'authority' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>City Police & Admin</span>
                          {user.role === 'authority' && <CheckCircle size={12} className="text-emerald-700" />}
                        </button>

                        <button
                          onClick={() => { quickDemoLogin('merchant'); setUserOpen(false); }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                            user.role === 'merchant' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Local Shops & Deals</span>
                          {user.role === 'merchant' && <CheckCircle size={12} className="text-emerald-700" />}
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-1 px-2">
                      <button
                        onClick={() => { logout(); setUserOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <User size={14} /> Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden btn-ghost p-2"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {NAV_LINKS.map(({ to, icon: Icon, label, roles }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => { handleTabClick(roles); setMenuOpen(false); }}
                className={({ isActive }) =>
                  `nav-link w-full ${isActive ? 'nav-link-active' : ''}`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
