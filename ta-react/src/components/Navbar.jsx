import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function TaLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Shield backdrop */}
      <path d="M20 3L34 8.5V20C34 27.5 27.8 33.5 20 36.5C12.2 33.5 6 27.5 6 20V8.5L20 3Z"
        fill="#0B1220" stroke="#D4AF37" strokeWidth="1" strokeOpacity="0.4"/>
      {/* Car body */}
      <path d="M9 26.5L11 21.5L14 19H26L29 21.5L31 26.5H9Z" fill="#D4AF37"/>
      {/* Windshield / roofline */}
      <path d="M14.5 19L16 15.5H24L25.5 19H14.5Z" fill="#D4AF37" opacity="0.65"/>
      {/* Front wheel */}
      <circle cx="13.5" cy="26.5" r="3.2" fill="#0B1220" stroke="#D4AF37" strokeWidth="1"/>
      <circle cx="13.5" cy="26.5" r="1.4" fill="#D4AF37" opacity="0.55"/>
      {/* Rear wheel */}
      <circle cx="26.5" cy="26.5" r="3.2" fill="#0B1220" stroke="#D4AF37" strokeWidth="1"/>
      <circle cx="26.5" cy="26.5" r="1.4" fill="#D4AF37" opacity="0.55"/>
    </svg>
  );
}

export default function Navbar({ activePage }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', id: 'home' },
    { to: '/search', label: 'Buy a Car', id: 'search' },
    { to: '/sell', label: 'Sell a Car', id: 'sell' },
    { to: '/mechanic', label: 'Mechanics', id: 'mechanic' },
    { to: '/education', label: 'Education', id: 'education' },
    { to: '/spareparts', label: 'Spare Parts', id: 'spareparts' },
  ];

  return (
    <nav className={isMenuOpen ? 'menu-open' : ''}>
      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon"><TaLogo /></div>
        <div className="nav-logo-text-wrap">
          <span className="nav-logo-name">Trust Automobile</span>
          <span className="nav-logo-sub">Verified Marketplace</span>
        </div>
      </Link>

      <div className={`nav-menu-container ${isMenuOpen ? 'open' : ''}`}>
        <button className="nav-close-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">&times;</button>
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.id}>
              <Link to={link.to} className={activePage === link.id ? 'active' : ''}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-mobile-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-login">{user.name}</Link>
              <button className="btn-login" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="btn-login">Sign In</Link>
          )}
          <Link to="/post-ad" className="btn-post">+ Post an Ad</Link>
        </div>
      </div>

      <div className="nav-actions">
        <div className="desktop-actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-login">{user.name?.split(' ')[0]}</Link>
              <button className="btn-login" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="btn-login">Sign In</Link>
          )}
          <Link to="/post-ad" className="btn-post">+ Post an Ad</Link>
        </div>
        <button
          className={`nav-burger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
