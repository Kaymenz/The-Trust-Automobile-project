import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../utils/api';
import CarCard from '../components/CarCard';
import { CarCardSkeleton, StatCardSkeleton } from '../components/SkeletonLoader';

export default function Dashboard() {
  const { user, isSaved } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState('overview');

  const [myListings, setMyListings] = useState([]);
  const [savedCars, setSavedCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const [profileName, setProfileName] = useState({
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ')[1] || ''
  });

  const handleConfirmReceipt = async (orderId) => {
    if (!window.confirm('Are you sure you have received these parts and want to release escrow funds to the dealer?')) return;
    try {
      await api.updatePartsOrderStatus(orderId, 'Delivered');
      await api.updatePartsOrderPayment(orderId, 'Released');
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Delivered', paymentStatus: 'Released' } : o));
      showToast('Receipt confirmed and funds released to dealer!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to confirm receipt', 'error');
    }
  };

  const handleConfirmSale = async (orderId) => {
    try {
      await api.updatePartsOrderStatus(orderId, 'Confirmed');
      setSales(prev => prev.map(s => s._id === orderId ? { ...s, status: 'Confirmed' } : s));
      showToast('Order confirmed and packed!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to confirm order', 'error');
    }
  };

  const handleShipSale = async (orderId) => {
    try {
      await api.updatePartsOrderStatus(orderId, 'Shipped');
      setSales(prev => prev.map(s => s._id === orderId ? { ...s, status: 'Shipped' } : s));
      showToast('Order marked as shipped!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to mark as shipped', 'error');
    }
  };

  const handleSaveProfile = () => {
    showToast('Profile information updated successfully!', 'success');
  };

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

        // Load bookings for all users
        try {
          const bookingData = await api.getMyBookings();
          setBookings(bookingData || []);
        } catch (e) { console.warn('Bookings error:', e); }

        // Load parts orders (Purchases)
        try {
          const orderData = await api.getMyPartsPurchases();
          setOrders(orderData || []);
        } catch (e) { console.warn('Orders error:', e); }

        // Load sales if dealer
        if (user.role === 'parts_dealer') {
          try {
            const saleData = await api.getMyPartsSales();
            setSales(saleData || []);
          } catch (e) { console.warn('Sales error:', e); }
        }

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const refreshInterval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(refreshInterval);
  }, [user, navigate, lastRefresh]);

  const refreshStats = async () => {
    setLastRefresh(Date.now());
  };

  if (!user) return null;

  const initials = (user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this?')) return;
    try {
      await api.cancelBooking(bookingId);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert(err.message || 'Failed to cancel');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'bi-grid-1x2-fill' },
    { id: 'bookings', label: 'Bookings', icon: 'bi-calendar-event-fill', count: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length },
    { id: 'orders', label: 'Parts Orders', icon: 'bi-box-seam-fill', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'listings', label: 'My Listings', icon: 'bi-car-front-fill' },
    { id: 'saved', label: 'Saved Cars', icon: 'bi-heart-fill' },
    { id: 'settings', label: 'Settings', icon: 'bi-gear-fill' },
  ];

  if (user.role === 'parts_dealer') {
    navItems.splice(3, 0, { id: 'sales', label: 'Received Orders', icon: 'bi-receipt-cutoff', count: sales.filter(s => s.status === 'Pending').length });
  }

  const getStatLabels = () => {
    const baseLabels = [
      { key: 'totalListings', label: 'Active Listings', icon: 'bi-car-front-fill' },
      { key: 'activeListings', label: 'Listed Items', icon: 'bi-bookmark-fill' },
      { key: 'totalViews', label: 'Total Views', icon: 'bi-eye-fill' },
    ];
    switch (user.role) {
      case 'buyer':
        return [
          { key: 'savedCars', label: 'Saved Cars', icon: 'bi-heart-fill' },
          { key: 'totalBookings', label: 'Total Bookings', icon: 'bi-calendar-event' },
          { key: 'activeBookings', label: 'Active Bookings', icon: 'bi-hourglass-split' },
          { key: 'completedBookings', label: 'Completed', icon: 'bi-check-circle-fill' },
        ];
      case 'mechanic':
        return [
          { key: 'totalServices', label: 'Total Services', icon: 'bi-tools' },
          { key: 'completedServices', label: 'Completed', icon: 'bi-check-circle-fill' },
          { key: 'rating', label: 'Rating', icon: 'bi-star-fill' },
        ];
      case 'parts_dealer':
        return [
          { key: 'totalOrders', label: 'Total Sales', icon: 'bi-box-seam-fill' },
          { key: 'totalItems', label: 'Items Sold', icon: 'bi-stack' },
        ];
      default: return baseLabels;
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
                {item.count > 0 && (
                  <span style={{ marginLeft: 'auto', background: 'var(--gold-500)', color: 'var(--navy-900)', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 7px' }}>{item.count}</span>
                )}
              </button>
            ))}
            <div className="dash-nav-divider" />
            <Link to="/" className="dash-nav-item" style={{ color: 'var(--gold-400)' }}><i className="bi bi-house-fill" /> Back to Home</Link>
          </div>
        </div>

        <div className="dash-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Link to="/" className="btn-secondary" style={{ fontSize: 13 }}><i className="bi bi-arrow-left" /> Back to Home</Link>
            <button onClick={refreshStats} className="btn-secondary" style={{ fontSize: 13 }}><i className="bi bi-arrow-clockwise" /> Refresh</button>
          </div>

          {activePanel === 'overview' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Overview</h2></div>
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
                  {user.role !== 'mechanic' && <Link to="/mechanic" className="btn-secondary">Book a Mechanic</Link>}
                </div>
              </div>
            </div>
          )}

          {activePanel === 'bookings' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>My Bookings & Appointments</h2></div>
              <div className="form-card">
                {loading ? <div className="spinner" /> : bookings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {bookings.map(b => (
                      <div key={b._id} className="booking-card">
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <span className={`booking-type-badge ${b.type}`}>
                                {b.type === 'test_drive' ? 'Test Drive' : b.type === 'purchase' ? 'Purchase' : b.type === 'service' ? 'Service' : 'Rental'}
                              </span>
                              <span className={`booking-status ${b.status}`}>{b.status}</span>
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy-900)', marginBottom: 4 }}>{b.vehicleDetails}</div>
                            <div style={{ fontSize: 12, color: 'var(--slate-500)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                              {b.preferredDate && <span><i className="bi bi-calendar" /> {new Date(b.preferredDate).toLocaleDateString()}</span>}
                              {b.preferredTime && <span><i className="bi bi-clock" /> {b.preferredTime}</span>}
                              <span><i className="bi bi-clock-history" /> {new Date(b.createdAt).toLocaleDateString()}</span>
                            </div>
                            {b.message && <div style={{ fontSize: 12, color: 'var(--slate-600)', marginTop: 8, padding: '8px 12px', background: 'var(--slate-50)', borderRadius: 8 }}>{b.message}</div>}
                          </div>
                          {(b.status === 'pending' || b.status === 'confirmed') && (
                            <button onClick={() => handleCancelBooking(b._id)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 11, color: '#dc3545' }}>Cancel</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted text-center p-40">No bookings found</p>}
              </div>
            </div>
          )}

          {activePanel === 'orders' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>My Parts Purchases</h2></div>
              <div className="form-card">
                {loading ? <div className="spinner" /> : orders.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {orders.map(o => (
                      <div key={o._id} className="booking-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div>
                            <div className={`booking-status ${o.status.toLowerCase()}`}>{o.status}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>Order #{o._id.slice(-6).toUpperCase()}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold-600)' }}>GHS {o.totalAmount.toLocaleString()}</div>
                            <div className="booking-status confirmed" style={{ fontSize: 9 }}>{o.paymentStatus.replace(/_/g, ' ')}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--slate-600)', marginBottom: 12 }}>
                          {o.items.map(i => `${i.partName} (x${i.quantity})`).join(', ')}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--slate-500)', display: 'flex', gap: 12 }}>
                          <span><i className="bi bi-truck" /> {o.deliveryLocation}</span>
                          <span><i className="bi bi-calendar" /> {new Date(o.createdAt).toLocaleDateString()}</span>
                        </div>
                        {o.paymentStatus === 'Escrow_Held' && o.status === 'Shipped' && (
                          <button onClick={() => handleConfirmReceipt(o._id)} className="btn-primary" style={{ marginTop: 16, width: '100%' }}>Confirm Receipt & Release Funds</button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted text-center p-40">No orders found</p>}
              </div>
            </div>
          )}

          {activePanel === 'sales' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Orders Received (Dealer)</h2></div>
              <div className="form-card">
                {loading ? <div className="spinner" /> : sales.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {sales.map(s => (
                      <div key={s._id} className="booking-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>Customer: {s.buyerId?.name || 'Guest'}</div>
                            <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>{s.buyerId?.email}</div>
                          </div>
                          <div className={`booking-status ${s.status.toLowerCase()}`}>{s.status}</div>
                        </div>
                        <div style={{ fontSize: 13, padding: '12px', background: 'var(--slate-50)', borderRadius: 8, margin: '12px 0' }}>
                          {s.items.map(i => (
                            <div key={i.sparePartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span>{i.partName} x{i.quantity}</span>
                              <span style={{ fontWeight: 600 }}>GHS {i.subtotal.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {s.status === 'Pending' && <button onClick={() => handleConfirmSale(s._id)} className="btn-primary" style={{ flex: 1 }}>Confirm & Pack</button>}
                          {s.status === 'Confirmed' && <button onClick={() => handleShipSale(s._id)} className="btn-primary" style={{ flex: 1 }}>Mark as Shipped</button>}
                          <button className="btn-secondary" style={{ flex: 1 }}>Contact Buyer</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-muted text-center p-40">No sales received yet</p>}
              </div>
            </div>
          )}

          {activePanel === 'listings' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>My Listings</h2><Link to="/post-ad" className="btn-primary">+ New Listing</Link></div>
              <div className="form-card">
                {loading ? <div className="cards-grid">{Array.from({ length: 4 }).map((_, i) => <CarCardSkeleton key={i} />)}</div>
                  : myListings.length > 0 ? <div className="cards-grid">{myListings.map(car => <CarCard key={car._id} car={car} />)}</div>
                  : <p className="text-muted text-center p-40">No listings found. <Link to="/post-ad" className="auth-link">Post an ad</Link></p>}
              </div>
            </div>
          )}

          {activePanel === 'saved' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Saved Cars</h2></div>
              <div className="form-card">
                {savedCars.length > 0 ? <div className="cards-grid">{savedCars.map(car => <CarCard key={car._id || car.id} car={car} />)}</div>
                  : <p className="text-muted text-center p-40">No saved cars. <Link to="/search" className="auth-link">Browse cars</Link></p>}
              </div>
            </div>
          )}

          {activePanel === 'settings' && (
            <div className="dash-panel active">
              <div className="dash-header"><h2>Account Settings</h2></div>
              <div className="form-card">
                <h3>Profile Information</h3>
                <div className="form-grid-2 mt-16">
                  <div className="form-group"><label>First Name</label><input value={profileName.firstName} onChange={e => setProfileName(prev => ({ ...prev, firstName: e.target.value }))} /></div>
                  <div className="form-group"><label>Last Name</label><input value={profileName.lastName} onChange={e => setProfileName(prev => ({ ...prev, lastName: e.target.value }))} /></div>
                </div>
                <div className="form-group mt-16"><label>Email</label><input defaultValue={user.email} disabled /></div>
                <button onClick={handleSaveProfile} className="btn-primary mt-16">Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
