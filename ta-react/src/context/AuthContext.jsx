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
        accessToken: data.accessToken,
      };
      localStorage.setItem('ta_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register with API
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);
      const newUser = {
        id: data.user.id || data.user._id,
        name: data.user.name || data.user.email,
        email: data.user.email,
        role: data.user.role,
        accessToken: data.accessToken,
      };
      localStorage.setItem('ta_user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    localStorage.removeItem('ta_user');
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('ta_user');
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
      };
      localStorage.setItem('ta_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      return null;
    }
  };

  const toggleSave = (id) => {
    setSavedCars(prev => {
      const next = prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id];
      localStorage.setItem('ta_saved', JSON.stringify(next));
      return next;
    });
  };

  const isSaved = (id) => savedCars.includes(id);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, fetchCurrentUser, savedCars, toggleSave, isSaved }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
