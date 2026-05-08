import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

const TABS = ['users', 'listings', 'reports', 'settings'];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // API data states
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, active: 0, pending: 0, blocked: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all users
        const usersData = await api.getUsers();
        setUsers(usersData);
        
        // Fetch stats from API
        try {
          const userStats = await api.getUserStats();
          setStats({
            totalUsers: userStats.total || usersData.length,
            active: userStats.active || 0,
            pending: userStats.pending || 0,
            blocked: userStats.blocked || 0,
          });
        } catch {
          const active = usersData.filter((u) => u.status === 'active').length;
          const pending = usersData.filter((u) => u.status === 'pending').length;
          const blocked = usersData.filter((u) => u.status === 'blocked').length;
          setStats({ totalUsers: usersData.length, active, pending, blocked });
        }
        
        // Fetch all listings
        const listingsData = await api.getListings({});
        setListings(listingsData);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        setError(err.message || 'Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="portal-page" style={{ textAlign: 'center', padding: 100 }}>
        <i className="bi bi-shield-lock" style={{ fontSize: 48, color: 'var(--slate-500)', display: 'block', marginBottom: 16 }}></i>
        <h2 style={{ color: 'var(--navy-900)', marginBottom: 8 }}>Access Denied</h2>
        <p style={{ color: 'var(--slate-500)', marginBottom: 20 }}>You need admin privileges to access this page.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  const updateUserStatus = async (userId, status) => {
    try {
      setActionLoading(true);
      setError('');
      await api.updateUser(userId, { status });
      setUsers((prev) => {
        const nextUsers = prev.map((u) => ((u._id || u.id) === userId ? { ...u, status } : u));
        const active = nextUsers.filter((u) => u.status === 'active').length;
        const pending = nextUsers.filter((u) => u.status === 'pending').length;
        const blocked = nextUsers.filter((u) => u.status === 'blocked').length;
        setStats({ totalUsers: nextUsers.length, active, pending, blocked });
        return nextUsers;
      });
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError(err.message || 'Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="portal-page" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Header */}
      <div className="portal-mobile-header">
        <Link to="/" className="ph-logo">
          <div style={{ width: 32, height: 32, background: 'var(--gold-500)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'var(--navy-900)', fontWeight: 800, fontSize: 14 }}>TA</span>
          </div>
          <span>Admin Panel</span>
        </Link>
        <button className="ph-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <i className={`bi bi-${mobileMenuOpen ? 'x-lg' : 'list'}`}></i>
        </button>
      </div>

      {/* Overlay for mobile */}
      <div className={`portal-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

      {/* Sidebar */}
      <aside className={`portal-sidebar dash-sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{ width: 240, background: 'var(--navy-900)', padding: '32px 0', flexShrink: 0 }}>
        <div className="dash-user">
          <div className="dash-user-inner">
            <div className="dash-avatar">TA</div>
            <div className="dash-name">Admin Panel</div>
          </div>
        </div>
        <div className="dash-nav">
          {TABS.map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setMobileMenuOpen(false); }}>
              <i className={`bi bi-${t === 'users' ? 'people' : t === 'listings' ? 'car-front' : t === 'reports' ? 'bar-chart' : 'gear'}`}></i> {t}
            </button>
          ))}
          <div className="dash-nav-divider"></div>
          <Link to="/" className="dash-nav-item" onClick={() => setMobileMenuOpen(false)}><i className="bi bi-house"></i> Back to Site</Link>
          <Link to="/dashboard" className="dash-nav-item" onClick={() => setMobileMenuOpen(false)}><i className="bi bi-person"></i> My Dashboard</Link>
        </div>
      </aside>

      <main className="portal-main dash-main" style={{ flex: 1, padding: '32px 36px', background: 'var(--slate-50)' }}>
        {error && (
          <div className="form-card" style={{ marginBottom: 16 }}>
            <p style={{ color: 'var(--no-600)' }}>{error}</p>
          </div>
        )}
        {tab === 'users' && (
          <>
            <div className="dash-header"><h2>User Management</h2></div>
            <div className="dash-stats mb-24">
              <div className="dash-stat-card"><h4>Total Users</h4><div className="dash-stat-num">{stats.totalUsers}</div></div>
              <div className="dash-stat-card"><h4>Active</h4><div className="dash-stat-num">{stats.active}</div></div>
              <div className="dash-stat-card"><h4>Pending</h4><div className="dash-stat-num">{stats.pending}</div></div>
              <div className="dash-stat-card"><h4>Blocked</h4><div className="dash-stat-num">{stats.blocked}</div></div>
            </div>
            <div className="form-card">
              {loading ? (
                <p style={{ textAlign: 'center', padding: 40, color: '#8FA3BD' }}>Loading users...</p>
              ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id || u.id}>
                      <td className="td-strong">{u.name || 'Unnamed User'}</td>
                      <td className="td-muted">{u.email}</td>
                      <td><span className={`badge ${u.role === 'seller' ? 'badge-gold' : u.role === 'mechanic' ? 'badge-blue' : 'badge-slate'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.status === 'active' ? 'badge-green' : u.status === 'pending' ? 'badge-gold' : 'badge-red'}`}>{u.status}</span></td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-secondary" onClick={() => updateUserStatus(u._id || u.id, 'active')} disabled={actionLoading}>Activate</button>
                        <button className="btn-secondary" onClick={() => updateUserStatus(u._id || u.id, 'blocked')} disabled={actionLoading}>Block</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
            </div>
          </>
        )}

        {tab === 'listings' && (
          <>
            <div className="dash-header"><h2>Listing Management</h2></div>
            <div className="form-card">
              {loading ? (
                <p style={{ textAlign: 'center', padding: 40, color: '#8FA3BD' }}>Loading listings...</p>
              ) : listings.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {listings.map(l => (
                    <div key={l._id} className="form-card" style={{ marginBottom: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{l.make} {l.model} {l.year}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginTop: 6 }}>GHS {l.price?.toLocaleString()}</div>
                      <span className={`badge ${l.status === 'active' ? 'badge-green' : 'badge-slate'}`} style={{ marginTop: 8 }}>{l.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center p-40">No listings found</p>
              )}
            </div>
          </>
        )}

        {tab === 'reports' && (
          <>
            <div className="dash-header"><h2>Reports & Analytics</h2></div>
            <div className="dash-stats">
              <div className="dash-stat-card"><h4>Monthly Revenue</h4><div className="dash-stat-num">GHS 45K</div></div>
              <div className="dash-stat-card"><h4>New Listings</h4><div className="dash-stat-num">89</div></div>
              <div className="dash-stat-card"><h4>Completed Sales</h4><div className="dash-stat-num">34</div></div>
              <div className="dash-stat-card"><h4>Active Users</h4><div className="dash-stat-num">1,089</div></div>
            </div>
          </>
        )}

        {tab === 'settings' && (
          <>
            <div className="dash-header"><h2>Platform Settings</h2></div>
            <div className="form-card">
              <h3>General Settings</h3>
              <div className="form-group mt-16"><label>Platform Name</label><input defaultValue="Trust Automobile Ghana" /></div>
              <div className="form-group mt-16"><label>Support Email</label><input defaultValue="support@trustautomobile.com" /></div>
              <button className="btn-primary mt-16">Save Settings</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
