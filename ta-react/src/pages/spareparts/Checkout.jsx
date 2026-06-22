import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    address: '', 
    city: '', 
    notes: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/spareparts/checkout');
    } else {
      setForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user, navigate]);

  const update = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const cart = (() => { 
    try { return JSON.parse(localStorage.getItem('ta_cart') || '[]'); } 
    catch { return []; } 
  })();

  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const deliveryFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address || !form.city || !form.phone) {
      setError('Please fill in all required delivery fields');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Group items by dealerId
      const ordersByDealer = cart.reduce((acc, item) => {
        const dealerId = item.dealerId || item.userId || 'system'; // fallback
        if (!acc[dealerId]) acc[dealerId] = [];
        acc[dealerId].push(item);
        return acc;
      }, {});

      // Create an order for each dealer
      for (const [dealerId, items] of Object.entries(ordersByDealer)) {
        const orderTotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
        
        await api.createPartsOrder({
          dealerId,
          items: items.map(i => ({
            sparePartId: i._id || i.id,
            partName: i.name,
            quantity: i.qty || 1,
            price: i.price,
            subtotal: i.price * (i.qty || 1)
          })),
          totalAmount: orderTotal,
          deliveryLocation: `${form.address}, ${form.city}`,
          status: 'Pending',
          paymentStatus: 'Escrow_Held' // Mock payment successful
        });
      }

      localStorage.removeItem('ta_cart');
      setPlaced(true);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <Layout activePage="spareparts">
        <div className="section" style={{ textAlign: 'center', padding: 80 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'var(--yes-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'
          }}>
            <i className="bi bi-shield-check" style={{ fontSize: 40, color: 'var(--yes-600)' }}></i>
          </div>
          <h2 style={{ marginBottom: 12, color: 'var(--slate-900)' }}>Payment Held in Escrow</h2>
          <p style={{ color: 'var(--slate-500)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Your payment of <strong>GHS {total.toLocaleString()}</strong> has been securely held. 
            The funds will only be released to the dealer once you confirm receipt of your parts.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/dashboard" className="btn-primary">View Orders</Link>
            <Link to="/spareparts" className="btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="spareparts">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="breadcrumb-sep">›</span>
            <Link to="/spareparts">Spare Parts</Link><span className="breadcrumb-sep">›</span>
            <span>Checkout</span>
          </div>
          <h1>Secure Checkout</h1>
          <p>Your payment is protected by our Trust Escrow system</p>
        </div>
      </div>

      <div className="section">
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, maxWidth: 1200, margin: '0 auto' }}>
          <div className="form-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="bi bi-truck" style={{ color: 'var(--gold-500)' }} />
              Delivery Information
            </h3>
            
            <div className="form-grid-2" style={{ marginTop: 20, marginBottom: 16 }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required placeholder="+233..." />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>Delivery Address *</label>
              <input value={form.address} onChange={e => update('address', e.target.value)} required placeholder="Street name, Area, etc." />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label>City *</label>
              <select value={form.city} onChange={e => update('city', e.target.value)} required>
                <option value="">Select City</option>
                <option>Accra</option>
                <option>Kumasi</option>
                <option>Takoradi</option>
                <option>Tamale</option>
                <option>Cape Coast</option>
                <option>Tema</option>
                <option>Koforidua</option>
              </select>
            </div>

            <div className="form-group">
              <label>Order Notes (Optional)</label>
              <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Any special instructions for delivery..." rows={3} />
            </div>
          </div>

          <div>
            <div style={{ background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--slate-100)', padding: 24, position: 'sticky', top: 100, boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--slate-900)', marginBottom: 20 }}>Order Summary</h4>
              
              <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 20 }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate-400)' }}>Qty: {item.qty || 1}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>GHS {(item.price * (item.qty || 1)).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed var(--slate-200)', paddingTop: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--slate-500)' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>GHS {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--slate-500)' }}>Delivery Fee</span>
                  <span style={{ fontWeight: 600 }}>GHS {deliveryFee.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--slate-900)' }}>Total</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--gold-400)' }}>GHS {total.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ background: 'var(--navy-800)', borderRadius: 12, padding: 16, marginBottom: 20, color: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <i className="bi bi-shield-lock-fill" style={{ color: 'var(--gold-400)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Trust Escrow™</span>
                </div>
                <p style={{ fontSize: 11, opacity: 0.8, lineHeight: 1.5 }}>
                  Your payment is held securely and only released when you confirm receipt.
                </p>
              </div>

              {error && <div style={{ color: 'var(--no-600)', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>{error}</div>}

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '14px', fontSize: 15 }} 
                disabled={loading || cart.length === 0}
              >
                {loading ? 'Processing...' : 'Pay & Secure with Escrow'}
              </button>
              
              <div style={{ textAlign: 'center', marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.5 }}>
                <i className="bi bi-credit-card" />
                <i className="bi bi-phone" />
                <i className="bi bi-bank" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
