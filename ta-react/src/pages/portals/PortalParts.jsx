import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DB from '../../utils/db';

export default function PortalParts() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState(() => DB.get('ta_spare_parts'));

  if (!user) return null;

  const addProduct = () => {
    const item = { id: DB.uid(), name: 'Brake Pads (Front)', price: 180, category: 'Brakes', stock: 24, status: 'active', date: new Date().toISOString() };
    DB.add('ta_spare_parts', item);
    setProducts(DB.get('ta_spare_parts'));
    showToast('Product added!');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: 240, background: 'var(--navy-900)', padding: '32px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 24px 28px', borderBottom: '1px solid rgba(143,163,189,0.15)', marginBottom: 16 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: '#8B4513', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-box-seam-fill" style={{ color: '#fff', fontSize: 16 }}></i></div>
            <div><div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>Parts Portal</div><div style={{ fontSize: 10, color: 'var(--slate-500)' }}>{user.name}</div></div>
          </Link>
        </div>
        <div style={{ padding: '0 12px' }}>
          {['products', 'orders', 'inventory', 'settings'].map(t => (
            <button key={t} className={`dash-nav-item ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
              <i className={`bi bi-${t === 'products' ? 'box-seam' : t === 'orders' ? 'bag-check' : t === 'inventory' ? 'archive' : 'gear'}`}></i> {t}
            </button>
          ))}
          <div className="dash-nav-divider"></div>
          <Link to="/dashboard" className="dash-nav-item"><i className="bi bi-house"></i> Dashboard</Link>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px 36px', background: 'var(--slate-50)' }}>
        {tab === 'products' && (
          <>
            <div className="dash-header"><h2>My Products</h2><button className="btn-primary" onClick={addProduct}>+ Add Product</button></div>
            {products.length === 0 ? (
              <div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No products yet. Click "Add Product" to get started.</p></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {products.map(p => (
                  <div key={p.id} className="form-card" style={{ marginBottom: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{p.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginTop: 6 }}>GHS {p.price}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 4 }}>Stock: {p.stock || 0}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {tab === 'orders' && <><div className="dash-header"><h2>Orders</h2></div><div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>No orders yet</p></div></>}
        {tab === 'inventory' && <><div className="dash-header"><h2>Inventory</h2></div><div className="form-card"><p style={{ color: 'var(--slate-500)', textAlign: 'center', padding: 40 }}>Inventory management coming soon</p></div></>}
        {tab === 'settings' && <><div className="dash-header"><h2>Settings</h2></div><div className="form-card"><h3>Shop Profile</h3><div className="form-group" style={{ marginTop: 16 }}><label>Shop Name</label><input defaultValue={user.name} /></div><button className="btn-primary" style={{ marginTop: 16 }}>Save</button></div></>}
      </div>
    </div>
  );
}
