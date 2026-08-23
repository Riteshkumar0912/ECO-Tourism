import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';

const AuthContext = createContext(null);

export const DEMO_PROFILES = {
  tourist: {
    id: 'tour-1',
    email: 'tourist@ecotourism.gov.in',
    fullName: 'Aarav Patel',
    role: 'tourist',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    defaultRoute: '/tourist',
  },
  authority: {
    id: 'auth-1',
    email: 'police.admin@ecotourism.gov.in',
    fullName: 'Insp. Vikram Singh (City Admin)',
    role: 'authority',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    defaultRoute: '/authority',
  },
  merchant: {
    id: 'merch-1',
    email: 'merchant@ecotourism.gov.in',
    fullName: 'Rajputana Hospitality Partner',
    role: 'merchant',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80',
    defaultRoute: '/hotel',
  },
};

const STORAGE_KEY = 'eco_tourism_auth_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' | 'signup'
  const [authModalRole, setAuthModalRole] = useState('tourist');

  // Initialize auth state from localStorage or Supabase session
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata?.fullName || 'Registered User',
              role: session.user.user_metadata?.role || 'tourist',
              avatar: session.user.user_metadata?.avatar || DEMO_PROFILES.tourist.avatar,
              metadata: session.user.user_metadata?.metadata || {},
            });
            setLoading(false);
            return;
          }
        }

        // Fallback to persisted local session
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Default initial state: Tourist profile for default out-of-box presentation
          setUser(DEMO_PROFILES.tourist);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PROFILES.tourist));
        }
      } catch (err) {
        console.warn('Auth initialization fallback:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const persistUserSession = (userObj) => {
    setUser(userObj);
    if (userObj) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const openAuthModal = (tab = 'signin', targetRole = 'tourist') => {
    setAuthModalTab(tab);
    setAuthModalRole(targetRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Standard Login (accepts role and extra credentials)
  const login = async (email, password, targetRole = 'tourist', extraFields = {}) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const u = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.fullName || email.split('@')[0],
          role: data.user.user_metadata?.role || targetRole,
          avatar: DEMO_PROFILES[targetRole]?.avatar || DEMO_PROFILES.tourist.avatar,
          metadata: data.user.user_metadata?.metadata || extraFields,
        };
        persistUserSession(u);
        closeAuthModal();
        return { success: true, user: u };
      }

      // Local fallback auth match
      const role = targetRole;
      const displayName = extraFields.officerName || extraFields.ownerName || extraFields.fullName || email.split('@')[0].toUpperCase();

      const u = {
        id: `usr-${Date.now()}`,
        email,
        fullName: displayName,
        role,
        avatar: DEMO_PROFILES[role]?.avatar || DEMO_PROFILES.tourist.avatar,
        metadata: extraFields,
      };
      persistUserSession(u);
      closeAuthModal();
      return { success: true, user: u };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Standard Sign Up (accepts formData object or parameters)
  const signUp = async (formData, targetRole = 'tourist') => {
    setLoading(true);
    try {
      const email = typeof formData === 'string' ? formData : formData.email;
      const password = typeof formData === 'string' ? arguments[1] : formData.password;
      const displayName = typeof formData === 'object'
        ? (formData.fullName || formData.ownerName || formData.officerName || email.split('@')[0])
        : (arguments[3] || email.split('@')[0]);

      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: targetRole, fullName: displayName, metadata: typeof formData === 'object' ? formData : {} },
          },
        });
        if (error) throw error;
        const u = {
          id: data.user?.id || `usr-${Date.now()}`,
          email,
          fullName: displayName,
          role: targetRole,
          avatar: DEMO_PROFILES[targetRole]?.avatar || DEMO_PROFILES.tourist.avatar,
          metadata: typeof formData === 'object' ? formData : {},
        };
        persistUserSession(u);
        closeAuthModal();
        return { success: true, user: u };
      }

      const u = {
        id: `usr-${Date.now()}`,
        email,
        fullName: displayName,
        role: targetRole,
        avatar: DEMO_PROFILES[targetRole]?.avatar || DEMO_PROFILES.tourist.avatar,
        metadata: typeof formData === 'object' ? formData : {},
      };
      persistUserSession(u);
      closeAuthModal();
      return { success: true, user: u };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      quickDemoLogin('tourist');
    }
  };

  // 1-Click Fast Judge/Demo Login
  const quickDemoLogin = (roleKey = 'tourist') => {
    const demoUser = DEMO_PROFILES[roleKey] || DEMO_PROFILES.tourist;
    persistUserSession(demoUser);
    closeAuthModal();
    return demoUser;
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    persistUserSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        authModalTab,
        authModalRole,
        openAuthModal,
        closeAuthModal,
        login,
        signUp,
        loginWithGoogle,
        quickDemoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
