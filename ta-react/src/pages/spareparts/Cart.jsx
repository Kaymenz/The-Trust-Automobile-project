import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ta_cart') || '[]'); } catch { return []; }
  });

  const updateQty = (idx, qty) => {
    const next = [...cart];
    next[idx] = { ...next[idx], qty: Math.max(1, qty) };
    localStorage.setItem('ta_cart', JSON.stringify(next));
    setCart(next);
  };

  const removeItem = (idx) => {
    const next = cart.filter((_, i) => i !== idx);
    localStorage.setItem('ta_cart', JSON.stringify(next));
    setCart(next);
  };

  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  if (cart.length === 0) {
    return (
      <Layout activePage="spareparts">
        <div className="section" style={{ textAlign: 'center', padding: 80 }}>
          <i className="bi bi-cart3" style={{ fontSize: 48, color: '#8FA3BD', display: 'block', marginBottom: 16 }}></i>
          <h2 style={{ marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ color: '#8FA3BD', marginBottom: 24 }}>Browse our spare parts shop to find what you need</p>
          <Link to="/spareparts" className="btn-primary">Browse Parts</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="spareparts">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb"><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><Link to="/spareparts">Spare Parts</Link><span className="breadcrumb-sep">›</span><span>Cart</span></div>
          <h1>Shopping Cart</h1>
          <p>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, maxWidth: 1100 }}>
          <div>
            {cart.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--slate-100)', padding: 20, marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: 10, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={item.image || "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=60"} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>{item.brand} · {item.category}</div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--gold-400)', marginTop: 6 }}>GHS {item.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => updateQty(idx, (item.qty || 1) - 1)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--slate-200)', background: 'var(--surface)', color: 'var(--slate-900)', cursor: 'pointer', fontSize: 16 }}>-</button>
                  <span style={{ fontWeight: 600, width: 24, textAlign: 'center', color: 'var(--slate-900)' }}>{item.qty || 1}</span>
                  <button onClick={() => updateQty(idx, (item.qty || 1) + 1)} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid var(--slate-200)', background: 'var(--surface)', color: 'var(--slate-900)', cursor: 'pointer', fontSize: 16 }}>+</button>
                </div>
                <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}><i className="bi bi-trash"></i></button>
              </div>
            ))}
          </div>

          <div>
            <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--slate-100)', padding: 24, position: 'sticky', top: 84 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: 'var(--slate-900)', marginBottom: 20 }}>Order Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--slate-500)', fontSize: 14 }}>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>GHS {total.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--slate-500)', fontSize: 14 }}>Delivery</span>
                <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>GHS 50</span>
              </div>
              <div style={{ height: 1, background: 'var(--slate-100)', margin: '16px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontWeight: 600, color: 'var(--slate-900)', fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--gold-400)' }}>GHS {(total + 50).toLocaleString()}</span>
              </div>
              <Link to="/spareparts/checkout" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Proceed to Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
