import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../utils/api';

export default function Mechanic() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [mechanics, setMechanics] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        setLoading(true);
        const filters = {};
        if (search) filters.search = search;
        if (specialty) filters.specialization = specialty;
        
        const data = await api.getMechanics(filters);
        setMechanics(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch mechanics:', err);
        setError('Failed to load mechanics. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, [search, specialty]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const specs = await api.getMechanicSpecializations();
        setSpecializations(specs);
      } catch (err) {
        console.error('Failed to fetch specializations:', err);
      }
    };
    fetchSpecializations();
  }, []);

  const filtered = mechanics;

  return (
    <Layout activePage="mechanic">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb"><Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span>Find a Mechanic</span></div>
          <h1>Find a Mechanic</h1>
          <p>Connect with verified automotive professionals across Ghana</p>
        </div>
      </div>

      <section className="section">
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search by name or location..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, minWidth: 250 }} />
          <select value={specialty} onChange={e => setSpecialty(e.target.value)}
            style={{ padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14 }}>
            <option value="">All Specialties</option>
            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#8FA3BD' }}>
            <div className="spinner" style={{ marginBottom: 16 }}></div>
            <p>Loading mechanics...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: 60, color: '#dc3545' }}>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {filtered.map(m => (
              <div key={m._id} className="form-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #1a4b8c, #e8a020)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="bi bi-tools" style={{ fontSize: 24, color: '#fff' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: '#0B1E3D', fontSize: 16 }}>{m.workshopName || m.user?.name || 'Workshop'}</span>
                    {m.status === 'active' && <span className="badge badge-green">Available</span>}
                  </div>
                  <div style={{ fontSize: 13, color: '#1A4B8C', fontWeight: 600, marginBottom: 4 }}>{m.specializations?.join(', ') || 'General auto services'}</div>
                  <div style={{ fontSize: 13, color: '#8FA3BD', display: 'flex', gap: 12 }}>
                    <span><i className="bi bi-geo-alt"></i> {m.city || 'Ghana'}</span>
                    <span><i className="bi bi-star-fill" style={{ color: '#E8A020' }}></i> {m.rating || 0} ({m.reviewCount || 0})</span>
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Book Now</button>
                    <button className="btn-secondary" style={{ padding: '7px 16px', fontSize: 13 }}>View Profile</button>
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
