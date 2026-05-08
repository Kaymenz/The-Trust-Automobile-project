import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';

export default function SpareParts() {
  const [categories, setCategories] = useState(['All']);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ta_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const filters = {};
        if (category !== 'All') filters.category = category;
        if (search) filters.search = search;
        
        const data = await api.getSpareParts(filters);
        setParts(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch spare parts:', err);
        setError('Failed to load spare parts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [category, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getPartCategories();
        setCategories(['All', ...(data || [])]);
      } catch (err) {
        console.error('Failed to fetch part categories:', err);
      }
    };
    fetchCategories();
  }, []);

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
          {categories.map(c => (
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

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#8FA3BD' }}>
            <div className="spinner" style={{ marginBottom: 16 }}></div>
            <p>Loading spare parts...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: 60, color: '#dc3545' }}>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>Retry</button>
          </div>
        )}

        {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {parts.map(part => (
            <div key={part._id || part.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8edf5', overflow: 'hidden', transition: 'all 0.25s' }}>
              <div style={{ height: 160, background: 'linear-gradient(135deg, #e8edf5, #d0daea)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {part.image ? (
                  <img src={part.image} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className="bi bi-box-seam" style={{ fontSize: 40, color: '#8FA3BD', opacity: 0.5 }}></i>
                )}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: '#1A4B8C', marginBottom: 4 }}>{part.category}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0B1E3D', marginBottom: 6 }}>{part.name}</div>
                <div style={{ fontSize: 12, color: '#8FA3BD', marginBottom: 8 }}>{part.brand}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#0B1E3D' }}>GHS {part.price}</div>
                  {(part.status === 'active' || part.status === 'out_of_stock') && (part.stock || 0) > 0 ? (
                    <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }} onClick={() => addToCart(part)}>Add to Cart</button>
                  ) : (
                    <span className="badge badge-red">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>
    </Layout>
  );
}
