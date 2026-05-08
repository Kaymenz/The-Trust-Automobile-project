import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export default function PortalMechanic() {
  const { user } = useAuth();
  const [tab, setTab] = useState('services');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState(null);
  const [newService, setNewService] = useState('');
  const [settings, setSettings] = useState({
    workshopName: '',
    city: '',
    address: '',
    specializations: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  useEffect(() => {
    const fetchMechanicProfile = async () => {
      try {
        setLoading(true);
        setError('');
        // Try to get mechanic profile
        const data = await api.getMyMechanicProfile();
        setProfile(data);
        setServices(data.services || []);
        setSettings({
          workshopName: data.workshopName || '',
          city: data.city || '',
          address: data.address || '',
          specializations: (data.specializations || []).join(', '),
        });
      } catch (err) {
        console.error('Failed to fetch mechanic profile:', err);
        setServices([]);
        setError('No mechanic profile found. Create one in Settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchMechanicProfile();
  }, []);

  const addService = async () => {
    if (!newService.trim()) return;

    if (!profile?._id) {
      setError('Create your mechanic profile first in Settings.');
      setTab('settings');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const nextServices = Array.from(new Set([...(services || []), newService.trim()]));
      const updated = await api.updateMechanicProfile(profile._id, { services: nextServices });
      setProfile(updated);
      setServices(updated.services || nextServices);
      setNewService('');
    } catch (err) {
      console.error('Failed to add service:', err);
      setError(err.message || 'Failed to add service.');
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    if (!settings.workshopName || !settings.city || !settings.address) {
      setError('Workshop name, city, and address are required.');
      return;
    }

    const payload = {
      workshopName: settings.workshopName,
      city: settings.city,
      address: settings.address,
      specializations: settings.specializations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);
      setError('');
      const response = profile?._id
        ? await api.updateMechanicProfile(profile._id, payload)
        : await api.createMechanicProfile(payload);
      setProfile(response);
      setServices(response.services || []);
    } catch (err) {
      console.error('Failed to save mechanic profile:', err);
      setError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const navItems = ['services', 'bookings', 'reviews', 'settings'];

  return (
    <div className="portal-page" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Header */}
      <div className="portal-mobile-header">
        <Link to="/" className="ph-logo">
          <div style={{ width: 32, height: 32, background: '#E8A020', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-tools" style={{ color: 'var(--navy-900)', fontSize: 14 }}></i>
          </div>
          <span>Mechanic Portal</span>
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
            <div style={{ width: 36, height: 36, background: '#E8A020', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-tools" style={{ color: 'var(--navy-900)', fontSize: 16 }}></i></div>
            <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Mechanic Portal</div><div style={{ fontSize: 10, color: 'var(--slate-500)' }}>{user.name}</div></div>
          </Link>
        </div>
        <div style={{ padding: '0 12px' }}>
          {navItems.map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setMobileMenuOpen(false); }} style={{ textTransform: 'capitalize' }}>
              <i className={`bi bi-${t === 'services' ? 'wrench' : t === 'bookings' ? 'calendar-check' : t === 'reviews' ? 'star' : 'gear'}`}></i> {t}
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
        {tab === 'services' && (
          <>
            <div className="dash-header">
              <h2>My Services</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="e.g. Engine Diagnostics"
                  style={{ padding: '8px 12px', border: '1px solid var(--slate-200)', borderRadius: 8 }}
                />
                <button className="btn-primary" onClick={addService} disabled={saving}>+ Add Service</button>
              </div>
            </div>
            {loading ? (
              <div className="form-card"><p style={{ textAlign: 'center', padding: 40, color: '#8FA3BD' }}>Loading services...</p></div>
            ) : services.length === 0 ? (
              <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No services listed. Click "Add Service" to get started.</p></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {services.map((s) => (
                  <div key={s} className="form-card" style={{ marginBottom: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{s}</div>
                    <div style={{ fontSize: 13, color: 'var(--slate-500)', marginTop: 6 }}>Service listed</div>
                    <span className="badge badge-green" style={{ marginTop: 8 }}>active</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {tab === 'bookings' && <><div className="dash-header"><h2>Bookings</h2></div><div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>Completed jobs: {profile?.completedJobs || 0}</p></div></>}
        {tab === 'reviews' && <><div className="dash-header"><h2>Reviews</h2></div><div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>Rating: {profile?.rating || 0} ({profile?.reviewCount || 0} reviews)</p></div></>}
        {tab === 'settings' && (
          <>
            <div className="dash-header"><h2>Settings</h2></div>
            <div className="form-card">
              <h3>Workshop Profile</h3>
              <div className="form-grid-2" style={{ marginTop: 16 }}>
                <div className="form-group"><label>Workshop Name *</label><input value={settings.workshopName} onChange={(e) => setSettings((s) => ({ ...s, workshopName: e.target.value }))} /></div>
                <div className="form-group"><label>City *</label><input value={settings.city} onChange={(e) => setSettings((s) => ({ ...s, city: e.target.value }))} /></div>
              </div>
              <div className="form-group" style={{ marginTop: 16 }}><label>Address *</label><input value={settings.address} onChange={(e) => setSettings((s) => ({ ...s, address: e.target.value }))} /></div>
              <div className="form-group" style={{ marginTop: 16 }}><label>Specializations (comma-separated)</label><input value={settings.specializations} onChange={(e) => setSettings((s) => ({ ...s, specializations: e.target.value }))} /></div>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={saveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
