import { useAuth, DEMO_PROFILES } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, UserCheck, Lock, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, openAuthModal, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-sm w-full text-center space-y-3 shadow-sm">
          <div className="w-8 h-8 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-bold text-slate-800">Verifying Role Credentials…</div>
        </div>
      </div>
    );
  }

  // Unauthenticated Handler
  if (!user) {
    const targetRole = allowedRoles[0] || 'tourist';
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-6 text-slate-900">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-700">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Authentication Required</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">
              Please sign in to access this portal. Role-based access control is active.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                quickDemoLogin(targetRole);
                navigate(location.pathname, { replace: true });
              }}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              1-Click Demo Login <ArrowRight size={14} />
            </button>

            <button
              onClick={() => openAuthModal('signin')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-lg transition-all"
            >
              Standard Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Role Mismatch Access Denied Handler
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const requiredRoleName =
      allowedRoles.includes('authority') ? 'City Police & Admin' :
      allowedRoles.includes('merchant') ? 'Local Merchant' : 'Tourist / Citizen';

    const requiredDemoKey = allowedRoles[0] || 'tourist';

    const handleSwitchRole = () => {
      quickDemoLogin(requiredDemoKey);
      navigate(location.pathname, { replace: true });
    };

    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-6 text-slate-900">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Role Verification Required</h2>
            <div className="mt-1 text-xs text-slate-500 font-medium">
              Active Session: <strong className="text-slate-900 font-bold uppercase font-mono">{user.role}</strong>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Required Portal Access: <strong className="text-emerald-800 font-bold">{requiredRoleName}</strong>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-200 text-left">
            Currently logged in as <strong>{user.fullName}</strong>. To view this portal, switch to the <strong>{requiredRoleName}</strong> role below.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleSwitchRole}
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              Switch to {requiredRoleName} Demo <ArrowRight size={14} />
            </button>

            <button
              onClick={() => navigate('/tourist')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Home size={14} /> Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
