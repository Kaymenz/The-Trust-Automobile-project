import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function PortalRenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tab, setTab] = useState('bookings');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSaveSettings = () => {
    showToast('Profile settings saved successfully!', 'success');
  };

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  useEffect(() => {
    const fetchFleet = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getAvailableFleet({ limit: 20 });
        setFleet(data || []);
      } catch (err) {
        console.error('Failed to fetch fleet:', err);
        setError(err.message || 'Failed to load rental options.');
      } finally {
        setLoading(false);
      }
    };

    fetchFleet();
  }, []);

  const navItems = ['bookings', 'history', 'settings'];

  return (
    <div className="portal-page" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Header */}
      <div className="portal-mobile-header">
        <Link to="/" className="ph-logo">
          <div style={{ width: 32, height: 32, background: '#1A4B8C', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-key-fill" style={{ color: '#fff', fontSize: 14 }}></i>
          </div>
          <span>Renter Portal</span>
        </Link>
        <button className="ph-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <i className={`bi bi-${mobileMenuOpen ? 'x-lg' : 'list'}`}></i>
        </button>
      </div>

      {/* Overlay for mobile */}
      <div className={`portal-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

      {/* Sidebar */}
      <div className={`portal-sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{ width: 240, background: 'var(--navy-900)', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid rgba(143,163,189,0.15)', marginBottom: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: '#1A4B8C', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-key-fill" style={{ color: '#fff', fontSize: 16 }}></i></div>
            <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Renter Portal</div><div style={{ fontSize: 10, color: 'var(--slate-500)' }}>{user.name}</div></div>
          </Link>
        </div>
        <div style={{ padding: '0 12px' }}>
          {navItems.map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setMobileMenuOpen(false); }} style={{ textTransform: 'capitalize' }}>
              <i className={`bi bi-${t === 'bookings' ? 'calendar-check' : t === 'history' ? 'clock-history' : 'gear'}`}></i> {t}
            </button>
          ))}
          <div className="dash-nav-divider"></div>
          <Link to="/dashboard" className="dash-nav-item" onClick={() => setMobileMenuOpen(false)}><i className="bi bi-house"></i> Dashboard</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="portal-main" style={{ flex: 1, padding: '32px 36px', background: 'var(--slate-50)' }}>
        {tab === 'bookings' && (
          <>
            <div className="dash-header"><h2>Available Rentals</h2><Link to="/rent" className="btn-primary">Browse Full Fleet</Link></div>
            {loading ? (
              <div className="form-card"><p style={{ textAlign: 'center', padding: 40, color: '#8FA3BD' }}>Loading rental cars...</p></div>
            ) : error ? (
              <div className="form-card"><p style={{ color: 'var(--no-600)', textAlign: 'center', padding: 40 }}>{error}</p></div>
            ) : fleet.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {fleet.map((car) => (
                  <div key={car._id} className="form-card" style={{ marginBottom: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{car.make} {car.model}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 4 }}>
                      {car.year} • {car.category}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: 'var(--navy-900)' }}>
                      GHS {car.dailyRate?.toLocaleString()} / day
                    </div>
                    <span className={`badge ${car.status === 'available' ? 'badge-green' : 'badge-slate'}`} style={{ marginTop: 8 }}>{car.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No available rentals right now. <Link to="/rent" className="auth-link">Browse rental fleet</Link></p></div>
            )}
          </>
        )}
        {tab === 'history' && <><div className="dash-header"><h2>Rental History</h2></div><div className="form-card">{/* Pending backend endpoint family: GET /bookings/my */}<p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No rental history yet</p></div></>}
        {tab === 'settings' && <><div className="dash-header"><h2>Settings</h2></div><div className="form-card"><h3>Profile</h3><div className="form-group" style={{ marginTop: 16 }}><label>Full Name</label><input defaultValue={user.name} /></div><button onClick={handleSaveSettings} className="btn-primary" style={{ marginTop: 16 }}>Save</button></div></>}
      </div>
    </div>
  );
}
