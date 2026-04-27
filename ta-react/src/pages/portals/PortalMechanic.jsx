import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DB from '../../utils/db';

export default function PortalMechanic() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('services');
  const [services, setServices] = useState(() => DB.get('ta_mechanic_services'));

  if (!user) return null;

  const addService = () => {
    const item = { id: DB.uid(), name: 'Oil Change', price: 250, category: 'Maintenance', status: 'active', date: new Date().toISOString() };
    DB.add('ta_mechanic_services', item);
    setServices(DB.get('ta_mechanic_services'));
    showToast('Service added!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: 240, background: 'var(--navy-900)', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid rgba(143,163,189,0.15)', marginBottom: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: '#E8A020', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-tools" style={{ color: '#0B1E3D', fontSize: 16 }}></i></div>
            <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Mechanic Portal</div><div style={{ fontSize: 10, color: 'var(--slate-500)' }}>{user.name}</div></div>
          </Link>
        </div>
        <div style={{ padding: '0 12px' }}>
          {['services', 'bookings', 'reviews', 'settings'].map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
              <i className={`bi bi-${t === 'services' ? 'wrench' : t === 'bookings' ? 'calendar-check' : t === 'reviews' ? 'star' : 'gear'}`}></i> {t}
            </button>
          ))}
          <div className="dash-nav-divider"></div>
          <Link to="/dashboard" className="dash-nav-item"><i className="bi bi-house"></i> Dashboard</Link>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px 36px', background: 'var(--slate-50)' }}>
        {tab === 'services' && (
          <>
            <div className="dash-header"><h2>My Services</h2><button className="btn-primary" onClick={addService}>+ Add Service</button></div>
            {services.length === 0 ? (
              <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No services listed. Click "Add Service" to get started.</p></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {services.map(s => (
                  <div key={s.id} className="form-card" style={{ marginBottom: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{s.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginTop: 6 }}>GHS {s.price}</div>
                    <span className="badge badge-green" style={{ marginTop: 8 }}>{s.status}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {tab === 'bookings' && <><div className="dash-header"><h2>Bookings</h2></div><div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No bookings yet</p></div></>}
        {tab === 'reviews' && <><div className="dash-header"><h2>Reviews</h2></div><div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No reviews yet</p></div></>}
        {tab === 'settings' && <><div className="dash-header"><h2>Settings</h2></div><div className="form-card"><h3>Workshop Profile</h3><div className="form-group" style={{ marginTop: 16 }}><label>Workshop Name</label><input defaultValue={user.name} /></div><button className="btn-primary" style={{ marginTop: 16 }}>Save</button></div></>}
      </div>
    </div>
  );
}
