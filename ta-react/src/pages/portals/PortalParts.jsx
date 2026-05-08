import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export default function PortalParts() {
  const { user } = useAuth();
  const [tab, setTab] = useState('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', brand: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  const fetchPartsAndOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const partsData = await api.getMySpareParts();
      setProducts(partsData || []);
      setOrders([]);
    } catch (err) {
      console.error('Failed to fetch parts:', err);
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartsAndOrders();
  }, []);

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      setError('Name, category, and price are required to add a product.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await api.createSparePart({
        name: newProduct.name,
        category: newProduct.category,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock || 0),
        brand: newProduct.brand || undefined,
      });
      setNewProduct({ name: '', category: '', price: '', stock: '', brand: '' });
      await fetchPartsAndOrders();
      setTab('products');
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err.message || 'Failed to add product.');
    } finally {
      setSubmitting(false);
    }
  };

  const navItems = ['products', 'orders', 'inventory', 'settings'];

  return (
    <div className="portal-page" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Header */}
      <div className="portal-mobile-header">
        <Link to="/" className="ph-logo">
          <div style={{ width: 32, height: 32, background: '#8B4513', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-box-seam-fill" style={{ color: '#fff', fontSize: 14 }}></i>
          </div>
          <span>Parts Portal</span>
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
            <div style={{ width: 36, height: 36, background: '#8B4513', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-box-seam-fill" style={{ color: '#fff', fontSize: 16 }}></i></div>
            <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Parts Portal</div><div style={{ fontSize: 10, color: 'var(--slate-500)' }}>{user.name}</div></div>
          </Link>
        </div>
        <div style={{ padding: '0 12px' }}>
          {navItems.map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); setMobileMenuOpen(false); }} style={{ textTransform: 'capitalize' }}>
              <i className={`bi bi-${t === 'products' ? 'box-seam' : t === 'orders' ? 'bag-check' : t === 'inventory' ? 'archive' : 'gear'}`}></i> {t}
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
        {tab === 'products' && (
          <>
            <div className="dash-header"><h2>My Products</h2><button className="btn-primary" onClick={() => setTab('inventory')}>+ Add Product</button></div>
            {loading ? (
              <div className="form-card"><p style={{ textAlign: 'center', padding: 40, color: '#8FA3BD' }}>Loading products...</p></div>
            ) : products.length === 0 ? (
              <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No products yet. Click "Add Product" to get started.</p></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {products.map(p => (
                  <div key={p._id || p.id} className="form-card" style={{ marginBottom: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{p.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginTop: 6 }}>GHS {p.price}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 4 }}>Stock: {p.stock || p.quantity || 0}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {tab === 'orders' && (
          <>
            <div className="dash-header"><h2>Orders</h2></div>
            {/* Pending backend endpoint family: GET /parts/orders/my, PATCH /parts/orders/:id */}
            {loading ? (
              <div className="form-card"><p style={{ textAlign: 'center', padding: 40, color: '#8FA3BD' }}>Loading orders...</p></div>
            ) : orders.length > 0 ? (
              <div style={{ display: 'grid', gap: 16 }}>
                {orders.map(o => (
                  <div key={o._id} className="form-card" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Order #{o.orderNumber}</div>
                        <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 4 }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                      </div>
                      <span className={`badge ${o.status === 'completed' ? 'badge-green' : o.status === 'pending' ? 'badge-gold' : 'badge-slate'}`}>{o.status}</span>
                    </div>
                    <div style={{ marginTop: 12, fontSize: 14 }}>GHS {o.total}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No orders yet</p></div>
            )}
          </>
        )}
        {tab === 'inventory' && (
          <>
            <div className="dash-header"><h2>Inventory</h2></div>
            <div className="form-card">
              <h3>Add Product</h3>
              <div className="form-grid-2" style={{ marginTop: 16 }}>
                <div className="form-group"><label>Name *</label><input value={newProduct.name} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} /></div>
                <div className="form-group"><label>Category *</label><input value={newProduct.category} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))} /></div>
              </div>
              <div className="form-grid-3" style={{ marginTop: 16 }}>
                <div className="form-group"><label>Price *</label><input type="number" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} /></div>
                <div className="form-group"><label>Stock</label><input type="number" value={newProduct.stock} onChange={(e) => setNewProduct((p) => ({ ...p, stock: e.target.value }))} /></div>
                <div className="form-group"><label>Brand</label><input value={newProduct.brand} onChange={(e) => setNewProduct((p) => ({ ...p, brand: e.target.value }))} /></div>
              </div>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={addProduct} disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Product'}
              </button>
            </div>
            <div className="form-card">
              <h3>Stock Overview</h3>
              <p style={{ color: 'var(--slate-500)', marginTop: 8 }}>
                {products.length} products total, {products.filter((p) => (p.stock || 0) <= 5).length} low-stock items.
              </p>
            </div>
          </>
        )}
        {tab === 'settings' && <><div className="dash-header"><h2>Settings</h2></div><div className="form-card"><h3>Shop Profile</h3><div className="form-group" style={{ marginTop: 16 }}><label>Shop Name</label><input defaultValue={user.name} /></div><button className="btn-primary" style={{ marginTop: 16 }}>Save</button></div></>}
      </div>
    </div>
  );
}
