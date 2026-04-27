import { useState } from 'react';
import Layout from '../components/Layout';

const SAMPLE_MECHANICS = [
  { id: 1, name: 'Kwame Auto Clinic', specialty: 'Engine & Transmission', location: 'Accra', rating: 4.8, reviews: 124, available: true },
  { id: 2, name: 'Adom Brake & Suspension', specialty: 'Brakes & Suspension', location: 'Kumasi', rating: 4.6, reviews: 89, available: true },
  { id: 3, name: 'Tech Auto Electrical', specialty: 'Electrical & AC', location: 'Accra', rating: 4.7, reviews: 67, available: false },
  { id: 4, name: 'Mighty Body Works', specialty: 'Body & Paint', location: 'Takoradi', rating: 4.5, reviews: 45, available: true },
  { id: 5, name: 'Quick Fix Diagnostics', specialty: 'Diagnostics & Scanning', location: 'Accra', rating: 4.9, reviews: 156, available: true },
  { id: 6, name: 'Reliable Tyre & Wheel', specialty: 'Tyres & Alignment', location: 'Tamale', rating: 4.4, reviews: 32, available: true },
];

export default function Mechanic() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const filtered = SAMPLE_MECHANICS.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.location.toLowerCase().includes(search.toLowerCase())) return false;
    if (specialty && m.specialty !== specialty) return false;
    return true;
  });

  const specialties = [...new Set(SAMPLE_MECHANICS.map(m => m.specialty))];

  return (
    <Layout activePage="mechanic">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb"><a href="/">Home</a><span className="breadcrumb-sep">›</span><span>Find a Mechanic</span></div>
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
            {specialties.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {filtered.map(m => (
            <div key={m.id} className="form-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: 'linear-gradient(135deg, #1a4b8c, #e8a020)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="bi bi-tools" style={{ fontSize: 24, color: '#fff' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#0B1E3D', fontSize: 16 }}>{m.name}</span>
                  {m.available && <span className="badge badge-green">Available</span>}
                </div>
                <div style={{ fontSize: 13, color: '#1A4B8C', fontWeight: 600, marginBottom: 4 }}>{m.specialty}</div>
                <div style={{ fontSize: 13, color: '#8FA3BD', display: 'flex', gap: 12 }}>
                  <span><i className="bi bi-geo-alt"></i> {m.location}</span>
                  <span><i className="bi bi-star-fill" style={{ color: '#E8A020' }}></i> {m.rating} ({m.reviews})</span>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Book Now</button>
                  <button className="btn-secondary" style={{ padding: '7px 16px', fontSize: 13 }}>View Profile</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
