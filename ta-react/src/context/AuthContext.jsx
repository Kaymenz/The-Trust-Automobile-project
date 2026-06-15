import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ta_user') || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const [savedCars, setSavedCars] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ta_saved') || '[]'); } catch { return []; }
  });

  // Login with API
  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await api.login(credentials);
      const userData = {
        id: data.user.id || data.user._id,
        name: data.user.name || data.user.email,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        accessToken: data.accessToken,
      };
      localStorage.setItem('ta_user', JSON.stringify(userData));
      localStorage.setItem('ta_token', data.accessToken);
      api.setToken(data.accessToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register with API (creates account without logging in - OTP required)
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      // Store the email for OTP verification (don't log in yet)
      localStorage.setItem('ta_register_email', userData.email);
      return { success: true, message: data.message, email: userData.email };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Send OTP
  const sendOtp = async (email) => {
    setLoading(true);
    try {
      const data = await api.sendOtp(email);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and login user
  const verifyOtp = async (email, otp) => {
    setLoading(true);
    try {
      const data = await api.verifyOtp(email, otp);
      const userData = {
        id: data.user.id || data.user._id,
        name: data.user.name || data.user.email,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
        accessToken: data.accessToken,
      };
      localStorage.setItem('ta_user', JSON.stringify(userData));
      localStorage.setItem('ta_token', data.accessToken);
      localStorage.removeItem('ta_register_email');
      api.setToken(data.accessToken);
      setUser(userData);
      return { success: true, message: data.message, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    setLoading(true);
    try {
      const data = await api.resendOtp(email);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem('ta_user');
    localStorage.removeItem('ta_token');
    localStorage.removeItem('ta_register_email');
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('ta_user');
      localStorage.removeItem('ta_token');
      setUser(null);
    };

    window.addEventListener('ta:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('ta:unauthorized', handleUnauthorized);
  }, []);

  // Fetch current user from API
  const fetchCurrentUser = async () => {
    try {
      const data = await api.getCurrentUser();
      const userData = {
        id: data._id,
        name: `${data.profile?.firstName || ''} ${data.profile?.lastName || ''}`.trim() || data.email,
        email: data.email,
        role: data.role,
        status: data.status,
      };
      localStorage.setItem('ta_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  };

  const toggleSave = async (id) => {
    // Snapshot current list before any mutation — used for clean revert on failure
    const snapshot = savedCars;
    const alreadySaved = snapshot.includes(id);

    // Optimistic update
    setSavedCars(prev => {
      const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      localStorage.setItem('ta_saved', JSON.stringify(next));
      return next;
    });

    // Sync with server if logged in
    if (user) {
      try {
        if (alreadySaved) {
          await api.unsaveCar(id);
        } else {
          await api.saveCar(id);
        }
      } catch (err) {
        // Restore to the pre-optimistic snapshot directly — avoids stale-closure inversion
        setSavedCars(() => {
          localStorage.setItem('ta_saved', JSON.stringify(snapshot));
          return snapshot;
        });
        throw err; // let call sites show error feedback
      }
    }
  };

  const isSaved = (id) => savedCars.includes(id);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      sendOtp,
      verifyOtp,
      resendOtp,
      loading, 
      fetchCurrentUser, 
      savedCars, 
      toggleSave, 
      isSaved 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
