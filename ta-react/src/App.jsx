import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post-ad" element={<PostAd />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/education" element={<Education />} />
            <Route path="/mechanic" element={<Mechanic />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="/portals/seller" element={<PortalSeller />} />
            <Route path="/portals/renter" element={<PortalRenter />} />
            <Route path="/portals/mechanic" element={<PortalMechanic />} />
            <Route path="/portals/parts" element={<PortalParts />} />

            <Route path="/spareparts" element={<SpareParts />} />
            <Route path="/spareparts/cart" element={<Cart />} />
            <Route path="/spareparts/checkout" element={<Checkout />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
