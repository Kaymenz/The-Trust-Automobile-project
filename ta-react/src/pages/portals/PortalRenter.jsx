import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FLEET } from '../../data/fleet';

export default function PortalRenter() {
  const { user } = useAuth();
  const [tab, setTab] = useState('bookings');

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: 240, background: 'var(--navy-900)', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid rgba(143,163,189,0.15)', marginBottom: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: '#1A4B8C', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-key-fill" style={{ color: '#fff', fontSize: 16 }}></i></div>
            <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Renter Portal</div><div style={{ fontSize: 10, color: 'var(--slate-500)' }}>{user.name}</div></div>
          </Link>
        </div>
        <div style={{ padding: '0 12px' }}>
          {['bookings', 'history', 'settings'].map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
              <i className={`bi bi-${t === 'bookings' ? 'calendar-check' : t === 'history' ? 'clock-history' : 'gear'}`}></i> {t}
            </button>
          ))}
          <div className="dash-nav-divider"></div>
          <Link to="/dashboard" className="dash-nav-item"><i className="bi bi-house"></i> Dashboard</Link>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px 36px', background: 'var(--slate-50)' }}>
        {tab === 'bookings' && (
          <>
            <div className="dash-header"><h2>My Bookings</h2><Link to="/rent" className="btn-primary">+ New Booking</Link></div>
            <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No active bookings. <Link to="/rent" className="auth-link">Browse rental fleet</Link></p></div>
          </>
        )}
        {tab === 'history' && <><div className="dash-header"><h2>Rental History</h2></div><div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No rental history yet</p></div></>}
        {tab === 'settings' && <><div className="dash-header"><h2>Settings</h2></div><div className="form-card"><h3>Profile</h3><div className="form-group" style={{ marginTop: 16 }}><label>Full Name</label><input defaultValue={user.name} /></div><button className="btn-primary" style={{ marginTop: 16 }}>Save</button></div></>}
      </div>
    </div>
  );
}
