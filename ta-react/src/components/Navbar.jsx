import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent scroll when menu is open
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
        <div className="nav-logo-icon"><span>TA</span></div>
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
