import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';

export default function PortalSeller() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tab, setTab] = useState('listings');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const handleSaveSettings = () => {
    showToast('Business settings saved successfully!', 'success');
  };

  if (!user) { navigate('/login'); return null; }

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await api.getMyListings();
        setListings(data);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        setError(err.message || 'Failed to load your listings.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const addListing = () => {
    navigate('/post-ad');
  };

  const deleteListing = async (listingId) => {
    try {
      setDeletingId(listingId);
      setError('');
      await api.deleteListing(listingId);
      setListings((prev) => prev.filter((l) => l._id !== listingId));
    } catch (err) {
      console.error('Failed to delete listing:', err);
      setError(err.message || 'Failed to delete listing.');
    } finally {
      setDeletingId('');
    }
  };

  const navItems = ['listings', 'inquiries', 'analytics', 'settings'];

  return (
    <div className="portal-page" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Header */}
      <div className="portal-mobile-header">
        <Link to="/" className="ph-logo">
          <div style={{ width: 32, height: 32, background: '#1A7A3A', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-car-front-fill" style={{ color: '#fff', fontSize: 14 }}></i>
          </div>
          <span>Seller Portal</span>
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
            <div style={{ width: 36, height: 36, background: '#1A7A3A', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-car-front-fill" style={{ color: '#fff', fontSize: 16 }}></i></div>
            <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Seller Portal</div><div style={{ fontSize: 10, color: 'var(--slate-500)' }}>{user.name}</div></div>
          </Link>
        </div>
        <div style={{ padding: '0 12px' }}>
          {navItems.map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setMobileMenuOpen(false); }} style={{ textTransform: 'capitalize' }}>
              <i className={`bi bi-${t === 'listings' ? 'car-front' : t === 'inquiries' ? 'chat-dots' : t === 'analytics' ? 'bar-chart' : 'gear'}`}></i> {t}
            </button>
          ))}
          <div className="dash-nav-divider"></div>
          <Link to="/dashboard" className="dash-nav-item" onClick={() => setMobileMenuOpen(false)}><i className="bi bi-house"></i> Dashboard</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="portal-main" style={{ flex: 1, padding: '32px 36px', background: 'var(--slate-50)' }}>
        {error && (
          <div className="form-card" style={{ marginBottom: 16 }}>
            <p style={{ color: 'var(--no-600)' }}>{error}</p>
          </div>
        )}
        {tab === 'listings' && (
          <>
            <div className="dash-header"><h2>My Listings</h2><Link to="/post-ad" className="btn-primary">+ Add Listing</Link></div>
            {loading ? (
              <div className="form-card"><p style={{ textAlign: 'center', padding: 40, color: '#8FA3BD' }}>Loading your listings...</p></div>
            ) : listings.length === 0 ? (
              <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No listings yet. Click "Add Listing" to get started.</p></div>
            ) : (
              <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {listings.map(l => (
                  <div key={l._id} className="form-card" style={{ marginBottom: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{l.make} {l.model} {l.year}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginTop: 6 }}>GHS {l.price?.toLocaleString()}</div>
                    <span className={`badge ${l.status === 'active' ? 'badge-green' : 'badge-slate'}`} style={{ marginTop: 8 }}>{l.status}</span>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <Link to={`/listing/${l._id}`} className="btn-secondary">View</Link>
                      <button className="btn-secondary" onClick={() => deleteListing(l._id)} disabled={deletingId === l._id}>
                        {deletingId === l._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {tab === 'inquiries' && <><div className="dash-header"><h2>Inquiries</h2></div><div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>{/* Pending backend endpoint family: GET /seller/inquiries */}No inquiries yet</p></div></>}
        {tab === 'analytics' && <><div className="dash-header"><h2>Analytics</h2></div><div className="dash-stats">{/* Pending backend endpoint family: GET /seller/analytics */}<div className="dash-stat-card"><h4>Views</h4><div className="dash-stat-num">0</div></div><div className="dash-stat-card"><h4>Inquiries</h4><div className="dash-stat-num">0</div></div><div className="dash-stat-card"><h4>Conversion</h4><div className="dash-stat-num">0%</div></div></div></>}
        {tab === 'settings' && <><div className="dash-header"><h2>Settings</h2></div><div className="form-card"><h3>Profile</h3><div className="form-group" style={{ marginTop: 16 }}><label>Business Name</label><input defaultValue={user.name} /></div><button onClick={handleSaveSettings} className="btn-primary" style={{ marginTop: 16 }}>Save</button></div></>}
      </div>
    </div>
  );
}
