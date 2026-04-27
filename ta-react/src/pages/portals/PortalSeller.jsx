import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DB from '../../utils/db';

export default function PortalSeller() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState(() => DB.get('ta_seller_listings'));

  if (!user) { useNavigate()('/login'); return null; }

  const addListing = () => {
    const item = { id: DB.uid(), make: 'Toyota', model: 'Corolla', year: 2022, price: 85000, status: 'active', date: new Date().toISOString() };
    DB.add('ta_seller_listings', item);
    setListings(DB.get('ta_seller_listings'));
    showToast('Listing added!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: 240, background: 'var(--navy-900)', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid rgba(143,163,189,0.15)', marginBottom: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: '#1A7A3A', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-car-front-fill" style={{ color: '#fff', fontSize: 16 }}></i></div>
            <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Seller Portal</div><div style={{ fontSize: 10, color: 'var(--slate-500)' }}>{user.name}</div></div>
          </Link>
        </div>
        <div style={{ padding: '0 12px' }}>
          {['listings', 'inquiries', 'analytics', 'settings'].map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
              <i className={`bi bi-${t === 'listings' ? 'car-front' : t === 'inquiries' ? 'chat-dots' : t === 'analytics' ? 'bar-chart' : 'gear'}`}></i> {t}
            </button>
          ))}
          <div className="dash-nav-divider"></div>
          <Link to="/dashboard" className="dash-nav-item"><i className="bi bi-house"></i> Dashboard</Link>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px 36px', background: 'var(--slate-50)' }}>
        {tab === 'listings' && (
          <>
            <div className="dash-header"><h2>My Listings</h2><button className="btn-primary" onClick={addListing}>+ Add Listing</button></div>
            {listings.length === 0 ? (
              <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No listings yet. Click "Add Listing" to get started.</p></div>
            ) : (
              <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {listings.map(l => (
                  <div key={l.id} className="form-card" style={{ marginBottom: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{l.make} {l.model} {l.year}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginTop: 6 }}>GHS {l.price?.toLocaleString()}</div>
                    <span className={`badge ${l.status === 'active' ? 'badge-green' : 'badge-slate'}`} style={{ marginTop: 8 }}>{l.status}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {tab === 'inquiries' && <><div className="dash-header"><h2>Inquiries</h2></div><div className="form-card"><p style={{ color: '#8FA3BD', textAlign: 'center', padding: 40 }}>No inquiries yet</p></div></>}
        {tab === 'analytics' && <><div className="dash-header"><h2>Analytics</h2></div><div className="dash-stats"><div className="dash-stat-card"><h4>Views</h4><div className="dash-stat-num">0</div></div><div className="dash-stat-card"><h4>Inquiries</h4><div className="dash-stat-num">0</div></div><div className="dash-stat-card"><h4>Conversion</h4><div className="dash-stat-num">0%</div></div></div></>}
        {tab === 'settings' && <><div className="dash-header"><h2>Settings</h2></div><div className="form-card"><h3>Profile</h3><div className="form-group" style={{ marginTop: 16 }}><label>Business Name</label><input defaultValue={user.name} /></div><button className="btn-primary" style={{ marginTop: 16 }}>Save</button></div></>}
      </div>
    </div>
  );
}
