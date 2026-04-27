import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TABS = ['users', 'listings', 'reports', 'settings'];

const SAMPLE_USERS = [
  { id: 1, name: 'Kwame Asante', email: 'kwame@test.com', role: 'seller', status: 'active', joined: '2024-03-15' },
  { id: 2, name: 'Ama Mensah', email: 'ama@test.com', role: 'buyer', status: 'active', joined: '2024-05-20' },
  { id: 3, name: 'Kofi Boateng', email: 'kofi@test.com', role: 'mechanic', status: 'pending', joined: '2024-07-01' },
  { id: 4, name: 'Abena Darko', email: 'abena@test.com', role: 'renter', status: 'blocked', joined: '2024-08-10' },
];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-40 text-center">
        <i className="bi bi-shield-lock icon-48"></i>
        <h2 className="access-title">Access Denied</h2>
        <p className="text-muted mb-20">You need admin privileges to access this page.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-user-inner">
              <div className="dash-avatar">TA</div>
              <div className="dash-name">Admin Panel</div>
            </div>
        </div>
        <div className="dash-nav">
          {TABS.map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              <i className={`bi bi-${t === 'users' ? 'people' : t === 'listings' ? 'car-front' : t === 'reports' ? 'bar-chart' : 'gear'}`}></i> {t}
            </button>
          ))}
          <div className="dash-nav-divider"></div>
          <Link to="/" className="dash-nav-item"><i className="bi bi-house"></i> Back to Site</Link>
          <Link to="/dashboard" className="dash-nav-item"><i className="bi bi-person"></i> My Dashboard</Link>
        </div>
      </aside>

      <main className="dash-main">
        {tab === 'users' && (
          <>
            <div className="dash-header"><h2>User Management</h2></div>
            <div className="dash-stats mb-24">
              <div className="dash-stat-card"><h4>Total Users</h4><div className="dash-stat-num">1,247</div></div>
              <div className="dash-stat-card"><h4>Active</h4><div className="dash-stat-num">1,089</div></div>
              <div className="dash-stat-card"><h4>Pending</h4><div className="dash-stat-num">124</div></div>
              <div className="dash-stat-card"><h4>Blocked</h4><div className="dash-stat-num">34</div></div>
            </div>
            <div className="form-card">
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
                  {SAMPLE_USERS.map(u => (
                    <tr key={u.id}>
                      <td className="td-strong">{u.name}</td>
                      <td className="td-muted">{u.email}</td>
                      <td><span className={`badge ${u.role === 'seller' ? 'badge-gold' : u.role === 'mechanic' ? 'badge-blue' : 'badge-gray'}`}>{u.role}</span></td>
                      <td><span className={`badge ${u.status === 'active' ? 'badge-green' : u.status === 'pending' ? 'badge-gold' : 'badge-red'}`}>{u.status}</span></td>
                      <td><button className="btn-secondary">Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === 'listings' && (
          <>
            <div className="dash-header"><h2>Listing Management</h2></div>
            <div className="form-card"><p className="text-muted text-center p-40">Manage all car listings here</p></div>
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
      </div>
    </div>
  );
}
