import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav>
      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon"><span>TA</span></div>
        <div className="nav-logo-text-wrap">
          <span className="nav-logo-name">Trust Automobile</span>
          <span className="nav-logo-sub">Verified Marketplace</span>
        </div>
      </Link>
      <ul className="nav-links">
        <li><Link to="/" className={activePage === 'home' ? 'active' : ''}>Home</Link></li>
        <li><Link to="/search" className={activePage === 'search' ? 'active' : ''}>Buy a Car</Link></li>
        <li><Link to="/post-ad" className={activePage === 'post' ? 'active' : ''}>Sell a Car</Link></li>
        <li><Link to="/mechanic" className={activePage === 'mechanic' ? 'active' : ''}>Mechanics</Link></li>
      </ul>
      <div className="nav-actions">
        {user ? (
          <>
            <Link to="/dashboard" className="btn-login">{user.name?.split(' ')[0]}</Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn-login">Admin</Link>
            )}
            <button className="btn-login" onClick={handleLogout}>Sign Out</button>
            <Link to="/post-ad" className="btn-post">+ Post an Ad</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Sign In</Link>
            <Link to="/post-ad" className="btn-post">+ Post an Ad</Link>
          </>
        )}
      </div>
    </nav>
  );
}
