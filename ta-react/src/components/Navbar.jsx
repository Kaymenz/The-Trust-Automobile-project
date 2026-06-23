import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import goldenLamboLogo from '../assets/golden_lambo_logo.png';

function TaLogo() {
  return (
    <img
      src={goldenLamboLogo}
      alt="Trust Autopilot Logo"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        display: 'block'
      }}
    />
  );
}


function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navbar({ activePage }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
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
          <span className="nav-logo-name">Trust Autopilot</span>
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
          <button
            className="btn-theme-toggle"
            onClick={toggle}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
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