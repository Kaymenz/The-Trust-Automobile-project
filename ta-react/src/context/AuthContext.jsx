import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ta_user') || 'null'); } catch { return null; }
  });

  const [savedCars, setSavedCars] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ta_saved') || '[]'); } catch { return []; }
  });

  const login = (userData) => {
    localStorage.setItem('ta_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ta_user');
    setUser(null);
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
    <AuthContext.Provider value={{ user, login, logout, savedCars, toggleSave, isSaved }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
