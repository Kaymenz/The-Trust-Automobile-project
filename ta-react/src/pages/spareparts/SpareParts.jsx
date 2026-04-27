import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import DB from '../../utils/db';

const CATEGORIES = ['All', 'Engine', 'Brakes', 'Suspension', 'Electrical', 'Body Parts', 'Filters', 'Tyres'];

const SAMPLE_PARTS = [
  { id: 1, name: 'Brake Pads (Front Set)', price: 180, category: 'Brakes', brand: 'Bosch', inStock: true },
  { id: 2, name: 'Oil Filter - Toyota', price: 45, category: 'Filters', brand: 'Mann', inStock: true },
  { id: 3, name: 'Alternator 12V', price: 850, category: 'Electrical', brand: 'Valeo', inStock: true },
  { id: 4, name: 'Front Shock Absorber', price: 320, category: 'Suspension', brand: 'Sachs', inStock: false },
  { id: 5, name: 'Timing Belt Kit', price: 450, category: 'Engine', brand: 'Gates', inStock: true },
  { id: 6, name: 'Side Mirror (Left)', price: 120, category: 'Body Parts', brand: 'OEM', inStock: true },
  { id: 7, name: 'Tyre 205/55R16', price: 380, category: 'Tyres', brand: 'Michelin', inStock: true },
  { id: 8, name: 'Air Filter', price: 55, category: 'Filters', brand: 'K&N', inStock: true },
];

export default function SpareParts() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ta_cart') || '[]'); } catch { return []; }
  });

  const filtered = SAMPLE_PARTS.filter(p => {
    if (category !== 'All' && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const addToCart = (part) => {
    const next = [...cart, { ...part, qty: 1 }];
    localStorage.setItem('ta_cart', JSON.stringify(next));
    setCart(next);
  };

  const cartCount = cart.reduce((s, i) => s + (i.qty || 1), 0);

  return (
    <Layout activePage="spareparts">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb"><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span>Spare Parts</span></div>
          <h1>Spare Parts Shop</h1>
          <p>Browse verified parts from trusted dealers across Ghana</p>
        </div>
      </div>

      <section className="section">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input type="text" placeholder="Search parts..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14 }} />
          <Link to="/spareparts/cart" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="bi bi-cart3"></i> Cart ({cartCount})
          </Link>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{
                padding: '8px 18px', borderRadius: 20, border: `1.5px solid ${category === c ? '#E8A020' : '#e2e8f0'}`,
                background: category === c ? 'rgba(232,160,32,0.1)' : '#fff', color: category === c ? '#E8A020' : '#8FA3BD',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {filtered.map(part => (
            <div key={part.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf5', overflow: 'hidden', transition: 'all 0.25s' }}>
              <div style={{ height: 160, background: 'linear-gradient(135deg, #e8edf5, #d0daea)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-box-seam" style={{ fontSize: 40, color: '#8FA3BD', opacity: 0.5 }}></i>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#1A4B8C', marginBottom: 4 }}>{part.category}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1E3D', marginBottom: 6 }}>{part.name}</div>
                <div style={{ fontSize: 12, color: '#8FA3BD', marginBottom: 8 }}>{part.brand}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#0B1E3D' }}>GHS {part.price}</div>
                  {part.inStock ? (
                    <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => addToCart(part)}>Add to Cart</button>
                  ) : (
                    <span className="badge badge-red">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
