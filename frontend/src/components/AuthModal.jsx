import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, DEMO_PROFILES } from '../context/AuthContext';
import { X, Shield, Hotel, MapPin, CheckCircle, AlertCircle, Loader2, ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen, closeAuthModal, authModalTab,
    login, signUp, quickDemoLogin, loading
  } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(authModalTab || 'signin');
  const [selectedRole, setSelectedRole] = useState('tourist');

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    let res;
    if (activeTab === 'signin') {
      res = await login(email, password);
    } else {
      res = await signUp(email, password, selectedRole, fullName);
    }

    setIsSubmitting(false);

    if (res?.success) {
      const targetRoute = DEMO_PROFILES[res.user.role]?.defaultRoute || '/tourist';
      navigate(targetRoute);
    } else {
      setErrorMsg(res?.error || 'Authentication failed. Please try again.');
    }
  };

  const handleDemoClick = (roleKey) => {
    const user = quickDemoLogin(roleKey);
    const targetRoute = DEMO_PROFILES[roleKey]?.defaultRoute || '/tourist';
    navigate(targetRoute);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={closeAuthModal} />

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-emerald-800 px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h3 className="font-bold text-base text-white">ECO Tourism Platform Access</h3>
            <p className="text-emerald-100 text-xs font-medium">Role-Based Authentication Portal</p>
          </div>
          <button onClick={closeAuthModal} className="text-white/70 hover:text-white transition-opacity">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Sign In vs Register Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => { setActiveTab('signin'); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-md transition-all ${
                activeTab === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
              className={`flex-1 py-2 rounded-md transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name for Sign Up */}
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@organization.gov.in"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Role Selector for Sign Up */}
            {activeTab === 'signup' && (
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-slate-600">Select User Role</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('tourist')}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedRole === 'tourist'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <MapPin size={14} className="mx-auto text-emerald-700 mb-0.5" />
                    <div className="text-[10px]">Tourist / Citizen</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('authority')}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedRole === 'authority'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <Shield size={14} className="mx-auto text-emerald-700 mb-0.5" />
                    <div className="text-[10px]">City Police</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('merchant')}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      selectedRole === 'merchant'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <Hotel size={14} className="mx-auto text-emerald-700 mb-0.5" />
                    <div className="text-[10px]">Local Merchant</div>
                  </button>
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-2.5 rounded-lg flex items-center gap-2 font-medium">
                <AlertCircle size={14} className="shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <><Loader2 size={14} className="animate-spin" /> Authenticating…</>
              ) : (
                <>{activeTab === 'signin' ? 'Sign In to Account' : 'Register Account'} <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* ── Judge / Demo 1-Click Fast Login Section ───────────────── */}
          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <span>Judge & Demo Fast Access</span>
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[9px] px-2 py-0.5 rounded-md">1-Click</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoClick('tourist')}
                className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 py-2 rounded-lg text-[10px] font-bold transition-all text-center"
              >
                Login as Tourist
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('authority')}
                className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 py-2 rounded-lg text-[10px] font-bold transition-all text-center"
              >
                Login as City Police
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('merchant')}
                className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 py-2 rounded-lg text-[10px] font-bold transition-all text-center"
              >
                Login as Merchant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
