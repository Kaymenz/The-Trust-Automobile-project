import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import CarCard from '../components/CarCard';
import { CarCardSkeleton, StatCardSkeleton } from '../components/SkeletonLoader';

export default function Dashboard() {
  const { user, isSaved } = useAuth();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('overview');

  const [myListings, setMyListings] = useState([]);
  const [savedCars, setSavedCars] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Load role-specific stats from server
        const serverStats = await api.getDashboardStats();
        setStats(serverStats);

        // Load role-specific data based on user role
        if (user.role === 'seller') {
          const listings = await api.getMyListings();
          setMyListings(listings);
        } else if (user.role === 'buyer') {
          const saved = await api.getSavedCars();
          setSavedCars(saved);
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up auto-refresh every 30 seconds to get updated booking data
    const refreshInterval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(refreshInterval);
  }, [user, navigate, lastRefresh]);

  const refreshStats = async () => {
    setLastRefresh(Date.now());
  };

  if (!user) return null;

  const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'bi-grid-1x2-fill' },
    { id: 'listings', label: 'My Listings', icon: 'bi-car-front-fill' },
    { id: 'saved', label: 'Saved Cars', icon: 'bi-heart-fill' },
    { id: 'messages', label: 'Messages', icon: 'bi-chat-dots-fill' },
    { id: 'settings', label: 'Settings', icon: 'bi-gear-fill' },
  ];

  // Role-specific stat card labels
  const getStatLabels = () => {
    const baseLabels = [
      { key: 'totalListings', label: 'Active Listings', icon: 'bi-car-front-fill' },
      { key: 'activeListings', label: 'Listed Items', icon: 'bi-bookmark-fill' },
      { key: 'soldItems', label: 'Sold', icon: 'bi-bag-check-fill' },
      { key: 'totalViews', label: 'Total Views', icon: 'bi-eye-fill' },
    ];

    switch (user.role) {
      case 'seller':
        return [
          { key: 'totalListings', label: 'Total Listings', icon: 'bi-car-front-fill' },
          { key: 'activeListings', label: 'Active Listings', icon: 'bi-bookmark-fill' },
          { key: 'totalViews', label: 'Total Views', icon: 'bi-eye-fill' },
          { key: 'conversionRate', label: 'Conv. Rate', icon: 'bi-percent' },
        ];
      case 'buyer':
        return [
          { key: 'savedCars', label: 'Saved Cars', icon: 'bi-heart-fill' },
          { key: 'totalBookings', label: 'Total Bookings', icon: 'bi-calendar-event' },
          { key: 'activeBookings', label: 'Active Bookings', icon: 'bi-hourglass-split' },
          { key: 'completedBookings', label: 'Completed', icon: 'bi-check-circle-fill' },
        ];
      case 'renter':
        return [
          { key: 'totalRentals', label: 'Total Rentals', icon: 'bi-key-fill' },
          { key: 'activeRentals', label: 'Active Rentals', icon: 'bi-hourglass-split' },
          { key: 'completedRentals', label: 'Completed', icon: 'bi-check-circle-fill' },
        ];
      case 'mechanic':
        return [
          { key: 'totalServices', label: 'Total Services', icon: 'bi-tools' },
          { key: 'completedServices', label: 'Completed', icon: 'bi-check-circle-fill' },
          { key: 'rating', label: 'Rating', icon: 'bi-star-fill' },
        ];
      case 'parts_dealer':
        return [
          { key: 'totalOrders', label: 'Total Orders', icon: 'bi-box-seam-fill' },
          { key: 'totalItems', label: 'Items Sold', icon: 'bi-stack' },
        ];
      default:
        return baseLabels;
    }
  };

  return (
    <Layout activePage="dashboard">
      <div className="dash-layout">
        <div className="dash-sidebar">
          <div className="dash-user">
            <div className="dash-avatar">{initials}</div>
            <div className="dash-name">{user.name}</div>
            <div className="dash-role">{user.role?.replace(/_/g, ' ').toUpperCase() || 'Member'}</div>
          </div>
          <div className="dash-nav">
            {navItems.map(item => (
              <button key={item.id} className={`dash-nav-item ${activePanel === item.id ? 'active' : ''}`} onClick={() => setActivePanel(item.id)}>
                <i className={`bi ${item.icon}`} /> {item.label}
              </button>
            ))}
            <div className="dash-nav-divider" />
            {user.role === 'seller' && <Link to="/portals/seller" className="dash-nav-item"><i className="bi bi-shop" /> Seller Portal</Link>}
            {user.role === 'renter' && <Link to="/portals/renter" className="dash-nav-item"><i className="bi bi-key" /> Renter Portal</Link>}
            {user.role === 'mechanic' && <Link to="/portals/mechanic" className="dash-nav-item"><i className="bi bi-tools" /> Mechanic Portal</Link>}
            {user.role === 'parts_dealer' && <Link to="/portals/parts" className="dash-nav-item"><i className="bi bi-box-seam" /> Parts Portal</Link>}
            {user.role === 'admin' && <Link to="/admin" className="dash-nav-item"><i className="bi bi-shield-lock" /> Admin Panel</Link>}
            <div className="dash-nav-divider" />
            <Link to="/" className="dash-nav-item" style={{ color: 'var(--gold-400)' }}>
              <i className="bi bi-house-fill" /> Back to Home
            </Link>
          </div>
        </div>

        <div className="dash-main">
          {/* Back to Home — top bar shortcut */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 600, color: 'var(--navy-600)',
                background: '#fff', border: '1.5px solid var(--slate-200)',
                borderRadius: 'var(--r-md)', padding: '8px 16px',
                textDecoration: 'none', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy-500)'; e.currentTarget.style.color = 'var(--navy-900)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.color = 'var(--navy-600)'; }}
            >
              <i className="bi bi-arrow-left" /> Back to Home
            </Link>
            <button
              onClick={refreshStats}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 13, fontWeight: 600, color: 'var(--navy-600)',
                background: '#fff', border: '1.5px solid var(--slate-200)',
                borderRadius: 'var(--r-md)', padding: '8px 16px',
                cursor: 'pointer', transition: 'all .15s',
              }}
            >
              <i className="bi bi-arrow-clockwise" /> Refresh
            </button>
          </div>

          {activePanel === 'overview' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Dashboard Overview</h2></div>
              <div className="dash-stats">
                {loading || !stats ? (
                  Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                ) : (
                  getStatLabels().map((statConfig) => (
                    <div key={statConfig.key} className="dash-stat-card">
                      <h4>{statConfig.label}</h4>
                      <div className="dash-stat-num">{stats[statConfig.key] ?? '-'}</div>
                      <div className="dash-stat-change up"><i className={`bi ${statConfig.icon}`} /></div>
                    </div>
                  ))
                )}
              </div>
              <div className="form-card">
                <h3>Quick Actions</h3>
                <div className="form-actions mt-16">
                  {user.role === 'seller' && <Link to="/post-ad" className="btn-primary"><i className="bi bi-plus-circle" /> Post New Ad</Link>}
                  <Link to="/search" className="btn-secondary">Browse Marketplace</Link>
                  {user.role !== 'mechanic' && <Link to="/mechanic" className="btn-secondary">Find a Mechanic</Link>}
                </div>
              </div>
            </div>
          )}

          {activePanel === 'listings' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>My Listings</h2><Link to="/post-ad" className="btn-primary">+ New Listing</Link></div>
              <div className="form-card">
                {loading ? (
                  <div className="cards-grid">
                    {Array.from({ length: 4 }).map((_, i) => <CarCardSkeleton key={i} />)}
                  </div>
                ) : myListings.length > 0 ? (
                  <div className="cards-grid">
                    {myListings.map((car) => <CarCard key={car._id} car={car} />)}
                  </div>
                ) : (
                  <p className="text-muted text-center p-40">Your listings will appear here. <Link to="/post-ad" className="auth-link">Post your first ad</Link></p>
                )}
              </div>
            </div>
          )}

          {activePanel === 'saved' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Saved Cars</h2></div>
              <div className="form-card">
                {savedCars.length > 0 ? (
                  <div className="cards-grid">
                    {savedCars.map((car) => <CarCard key={car._id || car.id} car={car} />)}
                  </div>
                ) : (
                  <p className="text-muted text-center p-40">Cars you save will appear here. <Link to="/search" className="auth-link">Browse cars</Link></p>
                )}
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
                <div className="form-group mt-16"><label>Email</label><input defaultValue={user.email} disabled /></div>
                <button className="btn-primary mt-16">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
