import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LamborghiniIntro from './components/LamborghiniIntro';
import SearchModal from './components/SearchModal';

import Home from './pages/Home';
import Search from './pages/Search';
import Listing from './pages/Listing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostAd from './pages/PostAd';
import Rent from './pages/Rent';
import Sell from './pages/Sell';
import Education from './pages/Education';
import Mechanic from './pages/Mechanic';
import Admin from './pages/Admin';

import PortalSeller from './pages/portals/PortalSeller';
import PortalRenter from './pages/portals/PortalRenter';
import PortalMechanic from './pages/portals/PortalMechanic';
import PortalParts from './pages/portals/PortalParts';

import SpareParts from './pages/spareparts/SpareParts';
import Cart from './pages/spareparts/Cart';
import Checkout from './pages/spareparts/Checkout';

function AppRoutes() {
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const introRoutes = new Set(['/', '/dashboard']);
    if (introRoutes.has(location.pathname)) {
      setShowIntro(true);
    }
  }, [location.pathname]);

  return (
    <>
      {showIntro && <LamborghiniIntro key={location.pathname} onComplete={() => setShowIntro(false)} />}
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/education" element={<Education />} />
        <Route path="/mechanic" element={<Mechanic />} />

        {/* Public Access Pages */}
        <Route path="/rent" element={<Rent />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/spareparts" element={<SpareParts />} />

        {/* Protected Pages - Require Authentication */}
        <Route path="/post-ad" element={
          <ProtectedRoute>
            <PostAd />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/spareparts/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/spareparts/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        {/* Role-Based Portals */}
        <Route path="/portals/seller" element={
          <ProtectedRoute requiredRole="seller">
            <PortalSeller />
          </ProtectedRoute>
        } />
        <Route path="/portals/renter" element={
          <ProtectedRoute requiredRole="renter">
            <PortalRenter />
          </ProtectedRoute>
        } />
        <Route path="/portals/mechanic" element={
          <ProtectedRoute requiredRole="mechanic">
            <PortalMechanic />
          </ProtectedRoute>
        } />
        <Route path="/portals/parts" element={
          <ProtectedRoute requiredRole="parts_dealer">
            <PortalParts />
          </ProtectedRoute>
        } />

        {/* Admin Pages */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <SearchModal />
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}