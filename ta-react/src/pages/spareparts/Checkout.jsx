import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';

export default function Checkout() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', city: '', notes: '' });
  const [placed, setPlaced] = useState(false);
  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const cart = (() => { try { return JSON.parse(localStorage.getItem('ta_cart') || '[]'); } catch { return []; } })();
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);

  if (placed) {
    return (
      <Layout activePage="spareparts">
        <div className="section" style={{ textAlign: 'center', padding: 80 }}>
          <i className="bi bi-check-circle" style={{ fontSize: 64, color: '#15803d', display: 'block', marginBottom: 16 }}></i>
          <h2 style={{ marginBottom: 8 }}>Order Placed!</h2>
          <p style={{ color: '#8FA3BD', marginBottom: 24 }}>Your order has been placed successfully. You will receive a confirmation shortly.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="spareparts">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb"><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><Link to="/spareparts">Spare Parts</Link><span className="breadcrumb-sep">›</span><span>Checkout</span></div>
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>
      </div>

      <div className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, maxWidth: 1100 }}>
          <div className="form-card">
            <h3>Delivery Information</h3>
            <div className="form-grid-2" style={{ marginTop: 16, marginBottom: 16 }}>
              <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e => update('name', e.target.value)} /></div>
              <div className="form-group"><label>Phone *</label><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}><label>Email</label><input type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 16 }}><label>Delivery Address *</label><input value={form.address} onChange={e => update('address', e.target.value)} /></div>
            <div className="form-group" style={{ marginBottom: 16 }}><label>City *</label>
              <select value={form.city} onChange={e => update('city', e.target.value)}>
                <option value="">Select City</option><option>Accra</option><option>Kumasi</option><option>Takoradi</option><option>Tamale</option><option>Cape Coast</option>
              </select>
            </div>
            <div className="form-group"><label>Notes</label><textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any special instructions..." /></div>
          </div>

          <div>
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf5', padding: 24, position: 'sticky', top: 84 }}>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: '#0B1E3D', marginBottom: 20 }}>Order Summary</h4>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#5E7490' }}>{item.name} × {item.qty || 1}</span>
                  <span style={{ fontWeight: 600, color: '#0B1E3D' }}>GHS {(item.price * (item.qty || 1)).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ height: 1, background: '#f0f4f9', margin: '16px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#8FA3BD' }}>Delivery</span><span style={{ fontWeight: 600 }}>GHS 30</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#0B1E3D' }}>GHS {(total + 30).toLocaleString()}</span>
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={() => { localStorage.removeItem('ta_cart'); setPlaced(true); }}>Place Order</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
