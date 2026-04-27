import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('overview');

  if (!user) { navigate('/login'); return null; }

  const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'bi-grid-1x2-fill' },
    { id: 'listings', label: 'My Listings', icon: 'bi-car-front-fill' },
    { id: 'saved', label: 'Saved Cars', icon: 'bi-heart-fill' },
    { id: 'messages', label: 'Messages', icon: 'bi-chat-dots-fill' },
    { id: 'settings', label: 'Settings', icon: 'bi-gear-fill' },
  ];

  return (
    <Layout activePage="dashboard">
      <div className="dash-layout">
        <div className="dash-sidebar">
          <div className="dash-user">
            <div className="dash-avatar">{initials}</div>
            <div className="dash-name">{user.name}</div>
            <div className="dash-role">{user.role || 'Member'}</div>
          </div>
          <div className="dash-nav">
            {navItems.map(item => (
              <button key={item.id} className={`dash-nav-item ${activePanel === item.id ? 'active' : ''}`} onClick={() => setActivePanel(item.id)}>
                <i className={item.icon} /> {item.label}
              </button>
            ))}
            <div className="dash-nav-divider"></div>
            {user.role === 'seller' && <Link to="/portals/seller" className="dash-nav-item"><i className="bi bi-shop" /> Seller Portal</Link>}
            {user.role === 'renter' && <Link to="/portals/renter" className="dash-nav-item"><i className="bi bi-key" /> Renter Portal</Link>}
            {user.role === 'mechanic' && <Link to="/portals/mechanic" className="dash-nav-item"><i className="bi bi-tools" /> Mechanic Portal</Link>}
            {user.role === 'parts' && <Link to="/portals/parts" className="dash-nav-item"><i className="bi bi-box-seam" /> Parts Portal</Link>}
            {user.role === 'admin' && <Link to="/admin" className="dash-nav-item"><i className="bi bi-shield-lock" /> Admin Panel</Link>}
          </div>
        </div>

        <div className="dash-main">
          {activePanel === 'overview' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Dashboard Overview</h2></div>
              <div className="dash-stats">
                <div className="dash-stat-card"><h4>Active Listings</h4><div className="dash-stat-num">3</div><div className="dash-stat-change up">+1 this week</div></div>
                <div className="dash-stat-card"><h4>Total Views</h4><div className="dash-stat-num">284</div><div className="dash-stat-change up">+12%</div></div>
                <div className="dash-stat-card"><h4>Messages</h4><div className="dash-stat-num">8</div><div className="dash-stat-change up">+3 new</div></div>
                <div className="dash-stat-card"><h4>Saved Cars</h4><div className="dash-stat-num">5</div><div className="dash-stat-change up">+2</div></div>
              </div>
              <div className="form-card">
                <h3>Quick Actions</h3>
                <div className="form-actions mt-16">
                  <Link to="/post-ad" className="btn-primary"><i className="bi bi-plus-circle"></i> Post New Ad</Link>
                  <Link to="/search" className="btn-secondary">Browse Cars</Link>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'listings' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>My Listings</h2><Link to="/post-ad" className="btn-primary">+ New Listing</Link></div>
              <div className="form-card">
                <p className="text-muted text-center p-40">Your listings will appear here. <Link to="/post-ad" className="auth-link">Post your first ad</Link></p>
              </div>
            </div>
          )}

          {activePanel === 'saved' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Saved Cars</h2></div>
              <div className="form-card">
                <p className="text-muted text-center p-40">Cars you save will appear here. <Link to="/search" className="auth-link">Browse cars</Link></p>
              </div>
            </div>
          )}

          {activePanel === 'messages' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Messages</h2></div>
              <div className="form-card">
                <p className="text-muted text-center p-40">No messages yet</p>
              </div>
            </div>
          )}

          {activePanel === 'settings' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Account Settings</h2></div>
              <div className="form-card">
                <h3>Profile Information</h3>
                <div className="form-grid-2 mt-16">
                  <div className="form-group"><label>First Name</label><input defaultValue={user.firstName || user.name?.split(' ')[0]} /></div>
                  <div className="form-group"><label>Last Name</label><input defaultValue={user.lastName || user.name?.split(' ')[1] || ''} /></div>
                </div>
                <div className="form-group mt-16"><label>Email</label><input defaultValue={user.email} /></div>
                <button className="btn-primary mt-16">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
