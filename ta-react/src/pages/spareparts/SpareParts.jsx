import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import NavigationMap, { createPinIcon } from '../../components/NavigationMap';
import { api } from '../../utils/api';

function createPartIcon(status) {
  const color = status === 'active' ? '#E8A828' : '#94A3B8';
  const borderColor = status === 'active' ? '#0B1D35' : '#475569';
  return createPinIcon(color, borderColor, '⚙');
}

export default function SpareParts() {
  const [categories, setCategories] = useState(['All']);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' | 'map'
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

  // Parts that have GPS coordinates for the map
  const mappable = parts.filter(p => p.coordinates && p.coordinates.length === 2);

  // Coordinate getter for NavigationMap
  const getCoords = (p) => {
    if (!p.coordinates || p.coordinates.length !== 2) return null;
    return [p.coordinates[1], p.coordinates[0]]; // [lat, lng]
  };

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
        {/* Controls bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="Search parts..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--slate-200)', borderRadius: 8, fontSize: 14, minWidth: 200 }} />

          {/* Grid / Map toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn${view === 'grid' ? ' active' : ''}`}
              onClick={() => setView('grid')}
            >
              <i className="bi bi-grid-3x2-gap" /> Grid
            </button>
            <button
              className={`view-toggle-btn${view === 'map' ? ' active' : ''}`}
              onClick={() => setView('map')}
            >
              <i className="bi bi-map" /> Map
              {mappable.length > 0 && (
                <span style={{ background: 'var(--gold-500)', color: 'var(--navy-900)', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 6px', marginLeft: 2 }}>
                  {mappable.length}
                </span>
              )}
            </button>
          </div>

          <Link to="/spareparts/cart" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="bi bi-cart3"></i> Cart ({cartCount})
          </Link>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{
                padding: '8px 18px', borderRadius: 20, border: `1.5px solid ${category === c ? 'var(--gold-500)' : 'var(--slate-200)'}`,
                background: category === c ? 'rgba(212,175,55,0.1)' : 'var(--surface)', color: category === c ? 'var(--gold-400)' : 'var(--slate-500)',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && !error && (
          <div style={{ fontSize: 13, color: 'var(--slate-500)', marginBottom: 20 }}>
            {parts.length} part{parts.length !== 1 ? 's' : ''} found
            {view === 'map' && mappable.length < parts.length && (
              <span style={{ marginLeft: 8, color: 'var(--gold-700)' }}>
                ({parts.length - mappable.length} without map location)
              </span>
            )}
          </div>
        )}

        {loading && view === 'grid' && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--slate-500)' }}>
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

        {/* GRID VIEW */}
        {!error && view === 'grid' && !loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {parts.map(part => (
              <div key={part._id || part.id} style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--slate-100)', overflow: 'hidden', transition: 'all 0.25s' }}>
                <div style={{ height: 160, background: 'linear-gradient(135deg, var(--slate-100), var(--slate-200))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {part.image ? (
                    <img src={part.image} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=60" alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--navy-600)', marginBottom: 4 }}>{part.category}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy-900)', marginBottom: 6 }}>{part.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--slate-500)', marginBottom: 4 }}>{part.brand}</div>
                  {part.location && (
                    <div style={{ fontSize: 11, color: 'var(--slate-400)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="bi bi-geo-alt" style={{ fontSize: 10 }} /> {part.location}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: 'var(--navy-900)' }}>GHS {part.price}</div>
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

        {/* MAP VIEW */}
        {!error && view === 'map' && (
          <NavigationMap
            items={parts}
            loading={loading}
            getCoords={getCoords}
            getIcon={(p) => createPartIcon(p.status)}
            emptyMessage="No spare parts with map locations found. Dealers with physical locations will appear here."
            legendItems={[
              { color: '#E8A828', label: 'In Stock' },
              { color: '#94A3B8', label: 'Out of Stock' },
            ]}
            renderPopup={(part, { onNavigate }) => (
              <div className="map-popup" style={{ minWidth: 200 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--navy-600)', marginBottom: 2 }}>
                  {part.category}
                </div>
                <div className="map-popup-name">{part.name}</div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 2 }}>
                  {part.brand && <span>{part.brand} · </span>}
                  {part.location || 'Ghana'}
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: 'var(--navy-900)', marginTop: 6 }}>
                  GHS {part.price}
                </div>
                {part.genuine && (
                  <div style={{ marginTop: 4 }}>
                    <span className="badge badge-green" style={{ fontSize: 10 }}>Genuine</span>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  {(part.status === 'active') && (part.stock || 0) > 0 ? (
                    <button
                      className="btn-primary"
                      style={{ flex: 1, padding: '7px 12px', fontSize: 12 }}
                      onClick={() => addToCart(part)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="badge badge-red" style={{ flex: 1, textAlign: 'center', padding: '7px 12px' }}>Out of Stock</span>
                  )}
                  <button
                    className="btn-secondary"
                    style={{ padding: '7px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={onNavigate}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>
                    Navigate
                  </button>
                </div>
              </div>
            )}
          />
        )}

        {/* Empty state for grid view */}
        {!loading && !error && view === 'grid' && parts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--slate-500)' }}>
            <i className="bi bi-box-seam" style={{ fontSize: 40, display: 'block', marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>No spare parts found</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Try adjusting your search or category filter</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
