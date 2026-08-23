import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Map, Shield, Hotel, Leaf, ArrowRight, ArrowLeft, CheckCircle,
  AlertCircle, Lock, Mail, User, Phone, MapPin, Building,
  BadgeCheck, Award, Sparkles, Key
} from 'lucide-react';

const CITIES = ['Jaipur', 'Agra', 'Varanasi', 'Delhi', 'Goa'];
const BUSINESS_CATEGORIES = ['Hotel & Stay', 'Restaurant & Café', 'Handicrafts & Retail'];

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, signUp, quickDemoLogin, loading } = useAuth();

  const roleParam = searchParams.get('role') || 'tourist';
  const [activeRole, setActiveRole] = useState(
    ['tourist', 'authority', 'merchant'].includes(roleParam) ? roleParam : 'tourist'
  );

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize state with URL search param
  useEffect(() => {
    const r = searchParams.get('role');
    if (r && ['tourist', 'authority', 'merchant'].includes(r)) {
      setActiveRole(r);
    }
  }, [searchParams]);

  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    setSearchParams({ role: newRole });
    setError('');
    setSuccessMsg('');
  };

  // Tourist Form State
  const [touristForm, setTouristForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    mobile: '',
    preferredCity: 'Jaipur',
  });

  // Authority Form State
  const [authorityForm, setAuthorityForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    officerName: '',
    badgeId: '',
    designation: 'Inspector / Officer',
    station: 'Central Municipal Station',
    jurisdictionCity: 'Jaipur',
  });

  // Merchant Form State
  const [merchantForm, setMerchantForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    ownerName: '',
    gstin: '',
    category: 'Hotel & Stay',
    address: '',
    city: 'Jaipur',
    phone: '',
  });

  const getRedirectPath = (role) => {
    if (role === 'authority') return '/authority';
    if (role === 'merchant') return '/hotel';
    return '/tourist';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (activeRole === 'tourist') {
        if (activeTab === 'signup') {
          if (!touristForm.email || !touristForm.password || !touristForm.fullName) {
            throw new Error('Please fill in all required fields.');
          }
          if (touristForm.password !== touristForm.confirmPassword) {
            throw new Error('Passwords do not match.');
          }
          const res = await signUp(touristForm, 'tourist');
          if (!res.success) throw new Error(res.error || 'Registration failed.');
        } else {
          if (!touristForm.email || !touristForm.password) {
            throw new Error('Please enter your email and password.');
          }
          const res = await login(touristForm.email, touristForm.password, 'tourist', touristForm);
          if (!res.success) throw new Error(res.error || 'Sign in failed.');
        }
      } else if (activeRole === 'authority') {
        if (activeTab === 'signup') {
          if (!authorityForm.email || !authorityForm.password || !authorityForm.officerName || !authorityForm.badgeId) {
            throw new Error('Please fill in all officer credentials.');
          }
          if (authorityForm.password !== authorityForm.confirmPassword) {
            throw new Error('Passwords do not match.');
          }
          const res = await signUp(authorityForm, 'authority');
          if (!res.success) throw new Error(res.error || 'Officer registration failed.');
        } else {
          if (!authorityForm.email || !authorityForm.password || !authorityForm.badgeId) {
            throw new Error('Please enter official email, badge ID, and password.');
          }
          const res = await login(authorityForm.email, authorityForm.password, 'authority', authorityForm);
          if (!res.success) throw new Error(res.error || 'Officer sign in failed.');
        }
      } else if (activeRole === 'merchant') {
        if (activeTab === 'signup') {
          if (!merchantForm.email || !merchantForm.password || !merchantForm.businessName || !merchantForm.ownerName) {
            throw new Error('Please fill in all business registration fields.');
          }
          if (merchantForm.password !== merchantForm.confirmPassword) {
            throw new Error('Passwords do not match.');
          }
          const res = await signUp(merchantForm, 'merchant');
          if (!res.success) throw new Error(res.error || 'Merchant registration failed.');
        } else {
          if (!merchantForm.email || !merchantForm.password) {
            throw new Error('Please enter your business email and password.');
          }
          const res = await login(merchantForm.email, merchantForm.password, 'merchant', merchantForm);
          if (!res.success) throw new Error(res.error || 'Merchant sign in failed.');
        }
      }

      setSuccessMsg('Authentication successful! Redirecting...');
      setTimeout(() => {
        navigate(getRedirectPath(activeRole));
      }, 500);

    } catch (err) {
      setError(err.message || 'An authentication error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoBypass = (role) => {
    quickDemoLogin(role);
    navigate(getRedirectPath(role));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 md:p-10">

      {/* Top Protocol Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-xs">
            <Leaf size={18} />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">ECO Tourism AI</span>
            <span className="hidden sm:inline text-xs text-slate-500 font-medium ml-2 border-l border-slate-300 pl-2">Portal Gateway</span>
          </div>
        </Link>

        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
        >
          <ArrowLeft size={14} /> Return to Home
        </Link>
      </header>

      {/* Main Split-Screen Container */}
      <main className="max-w-6xl mx-auto w-full my-auto grid md:grid-cols-12 gap-8 items-center">

        {/* ── Left Column: Role Narrative & Context ───────────────────────── */}
        <div className="md:col-span-5 space-y-6">

          {/* Role Header Badge */}
          <div className="space-y-3">
            {activeRole === 'tourist' && (
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                <Map size={14} className="text-emerald-700" /> CITIZEN & TRAVELER PORTAL
              </div>
            )}
            {activeRole === 'authority' && (
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                <Shield size={14} className="text-emerald-700" /> CITY POLICE & ADMINISTRATION PORTAL
              </div>
            )}
            {activeRole === 'merchant' && (
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                <Hotel size={14} className="text-emerald-700" /> LOCAL MERCHANT & HOTEL PORTAL
              </div>
            )}

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {activeRole === 'tourist' && "Plan Smart Trips & Earn Eco-Perks"}
              {activeRole === 'authority' && "Command Center & Crowd Telemetry"}
              {activeRole === 'merchant' && "Merchant & Restaurant Exchange"}
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
              {activeRole === 'tourist' && "Plan smart trips, avoid heavy crowds, and earn green eco-discounts across heritage monuments."}
              {activeRole === 'authority' && "Access live CCTV edge AI vision, crowd saturation telemetry, and municipal reroute tools."}
              {activeRole === 'merchant' && "Attract diverted tourist footfall directly to your shop and publish live voucher discounts."}
            </p>
          </div>

          {/* Context Feature List */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs text-xs">
            <div className="font-bold text-slate-900 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Role Capabilities
            </div>
            {activeRole === 'tourist' && (
              <ul className="space-y-2 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Real-time crowd avoidance & Haversine smart itineraries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Exclusive entry discounts on alternate heritage spots</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Eco-certified stay reservations & verified digital passes</span>
                </li>
              </ul>
            )}
            {activeRole === 'authority' && (
              <ul className="space-y-2 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Edge AI camera visitor density telemetry & breach alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Instant municipal tourist reroute broadcasting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Audited activity log export & station command controls</span>
                </li>
              </ul>
            )}
            {activeRole === 'merchant' && (
              <ul className="space-y-2 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Attract diverted tourist footfall directly to your business</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Launch flash discount deals for overflow corridors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-700 shrink-0" />
                  <span>Live digital QR voucher redemption & earnings tracker</span>
                </li>
              </ul>
            )}
          </div>

          {/* Role Switcher Context Tabs */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Switch Role Context
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSwitch('tourist')}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  activeRole === 'tourist'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Map size={13} /> Tourist
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('authority')}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  activeRole === 'authority'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Shield size={13} /> Police & Admin
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('merchant')}
                className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                  activeRole === 'merchant'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Hotel size={13} /> Merchant
              </button>
            </div>
          </div>

          {/* Fast Judge Demo Login Bar */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-3.5 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div>
              <div className="font-bold text-white text-[11px]">Judge Presentation Bypass</div>
              <div className="text-[10px] text-slate-400">1-Click demo login as {activeRole}</div>
            </div>
            <button
              onClick={() => handleDemoBypass(activeRole)}
              className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors font-sans"
            >
              Demo Sign In
            </button>
          </div>

        </div>

        {/* ── Right Column: Clean White Form Card ────────────────────────── */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">

          {/* Form Tabs: Sign In vs Create Account */}
          <div className="flex border-b border-slate-200 pb-2 gap-4">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setError(''); }}
              className={`pb-2 text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'signin'
                  ? 'border-emerald-700 text-slate-900 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setError(''); }}
              className={`pb-2 text-sm font-bold transition-colors border-b-2 ${
                activeTab === 'signup'
                  ? 'border-emerald-700 text-slate-900 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alert Banners */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-xs font-medium flex items-center gap-2">
              <CheckCircle size={16} className="shrink-0 text-emerald-700" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* ── TOURIST FORMS ────────────────────────────────────────── */}
            {activeRole === 'tourist' && (
              <>
                {activeTab === 'signup' && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Aarav Patel"
                        value={touristForm.fullName}
                        onChange={(e) => setTouristForm({ ...touristForm, fullName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Mobile Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={touristForm.mobile}
                        onChange={(e) => setTouristForm({ ...touristForm, mobile: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="tourist@ecotourism.gov.in"
                    value={touristForm.email}
                    onChange={(e) => setTouristForm({ ...touristForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {activeTab === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Preferred Travel Destination</label>
                    <select
                      value={touristForm.preferredCity}
                      onChange={(e) => setTouristForm({ ...touristForm, preferredCity: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={touristForm.password}
                      onChange={(e) => setTouristForm({ ...touristForm, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {activeTab === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={touristForm.confirmPassword}
                        onChange={(e) => setTouristForm({ ...touristForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── CITY POLICE & AUTHORITY FORMS ─────────────────────────── */}
            {activeRole === 'authority' && (
              <>
                {activeTab === 'signup' && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Officer Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Insp. Vikram Singh"
                        value={authorityForm.officerName}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, officerName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Designation / Rank</label>
                      <input
                        type="text"
                        required
                        placeholder="Inspector / City Admin"
                        value={authorityForm.designation}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, designation: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Official Gov/Police Email</label>
                    <input
                      type="email"
                      required
                      placeholder="police.admin@ecotourism.gov.in"
                      value={authorityForm.email}
                      onChange={(e) => setAuthorityForm({ ...authorityForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Officer Badge / ID Number</label>
                    <input
                      type="text"
                      required
                      placeholder="RJ-POL-4402"
                      value={authorityForm.badgeId}
                      onChange={(e) => setAuthorityForm({ ...authorityForm, badgeId: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {activeTab === 'signup' && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Police Station / Division</label>
                      <input
                        type="text"
                        placeholder="Amber Fort Station"
                        value={authorityForm.station}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, station: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Station Jurisdiction City</label>
                      <select
                        value={authorityForm.jurisdictionCity}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, jurisdictionCity: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                      >
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authorityForm.password}
                      onChange={(e) => setAuthorityForm({ ...authorityForm, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {activeTab === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={authorityForm.confirmPassword}
                        onChange={(e) => setAuthorityForm({ ...authorityForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── LOCAL MERCHANT & PARTNER FORMS ────────────────────────── */}
            {activeRole === 'merchant' && (
              <>
                {activeTab === 'signup' && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Business / Shop / Hotel Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Rajputana Heritage Stay"
                        value={merchantForm.businessName}
                        onChange={(e) => setMerchantForm({ ...merchantForm, businessName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Owner Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Rajesh Sharma"
                        value={merchantForm.ownerName}
                        onChange={(e) => setMerchantForm({ ...merchantForm, ownerName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Business Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="merchant@ecotourism.gov.in"
                      value={merchantForm.email}
                      onChange={(e) => setMerchantForm({ ...merchantForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {activeTab === 'signup' ? (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">GSTIN / Trade License</label>
                      <input
                        type="text"
                        placeholder="08AAAAA0000A1Z5"
                        value={merchantForm.gstin}
                        onChange={(e) => setMerchantForm({ ...merchantForm, gstin: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 12345"
                        value={merchantForm.phone}
                        onChange={(e) => setMerchantForm({ ...merchantForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {activeTab === 'signup' && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Business Category</label>
                      <select
                        value={merchantForm.category}
                        onChange={(e) => setMerchantForm({ ...merchantForm, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                      >
                        {BUSINESS_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">City</label>
                      <select
                        value={merchantForm.city}
                        onChange={(e) => setMerchantForm({ ...merchantForm, city: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                      >
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={merchantForm.password}
                      onChange={(e) => setMerchantForm({ ...merchantForm, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {activeTab === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={merchantForm.confirmPassword}
                        onChange={(e) => setMerchantForm({ ...merchantForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{activeTab === 'signin' ? `Sign In as ${activeRole.toUpperCase()}` : `Register ${activeRole.toUpperCase()} Account`}</span>
              <ArrowRight size={15} />
            </button>
          </form>

        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-400 font-medium pt-8">
        Government of India · Ministry of Tourism & Smart Cities Mission Evaluation Platform
      </footer>

    </div>
  );
}
