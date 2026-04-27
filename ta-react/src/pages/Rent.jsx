import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { FLEET } from '../data/fleet';

const TYPES = ['all', 'economy', 'compact', 'suv', 'luxury', 'electric', 'minivan'];

export default function Rent() {
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = filter === 'all' ? FLEET : FLEET.filter(f => f.type === filter);
  const visible = filtered.slice(0, visibleCount);

  return (
    <Layout activePage="rent">
      <section className="rent-hero">
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 700 }}>
          <div className="hero-badge" style={{ marginBottom: 24 }}>
            <i className="bi bi-key-fill"></i> Verified Rental Fleet — All Operators Inspected
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 5vw, 66px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, marginBottom: 20 }}>
            Rent With<br /><em style={{ fontStyle: 'normal', color: '#E8A020' }}>Confidence.</em><br />Drive With Trust.
          </h1>
          <p style={{ fontSize: 17, color: '#8FA3BD', lineHeight: 1.6, marginBottom: 32, maxWidth: 500 }}>
            Browse verified rental vehicles from licensed operators across Ghana. No hidden fees, no fake listings.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#fleet" className="btn-primary"><i className="bi bi-search"></i> Browse Fleet</a>
            <a href="tel:+233000000000" className="btn-secondary" style={{ borderColor: '#8FA3BD', color: '#8FA3BD' }}><i className="bi bi-telephone"></i> Call Us Now</a>
          </div>
        </div>
      </section>

      <section className="section" id="fleet">
        <div className="section-header">
          <div>
            <div className="section-title">Rental <span>Fleet</span></div>
            <div className="section-subtitle">Choose from our verified rental vehicles</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => { setFilter(t); setVisibleCount(6); }}
              style={{
                padding: '8px 18px', borderRadius: 20, border: `1.5px solid ${filter === t ? '#E8A020' : '#e2e8f0'}`,
                background: filter === t ? 'rgba(232,160,32,0.1)' : '#fff', color: filter === t ? '#E8A020' : '#8FA3BD',
                fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
              }}>
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>

        <div className="rent-fleet-grid">
          {visible.map(car => (
            <div key={car.id} className="fleet-card">
              <div className="fleet-card-img">
                <img src={car.img} alt={car.name} loading="lazy" />
              </div>
              <div className="fleet-card-body">
                <div className="fleet-card-name">{car.name}</div>
                <div className="fleet-card-sub">{car.subtitle}</div>
                <div className="fleet-card-price">GHS {car.price} <span>/day</span></div>
                <div className="fleet-card-specs">
                  <span className="fleet-card-spec"><i className="bi bi-people"></i> {car.seats}</span>
                  <span className="fleet-card-spec"><i className="bi bi-fuel-pump"></i> {car.fuel}</span>
                  <span className="fleet-card-spec"><i className="bi bi-gear"></i> {car.transmission}</span>
                  <span className="fleet-card-spec"><i className="bi bi-geo-alt"></i> {car.location}</span>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: 12, padding: '10px' }}>Book Now</button>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < filtered.length && (
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button className="btn-secondary" onClick={() => setVisibleCount(c => c + 6)}>Load More</button>
          </div>
        )}
      </section>
    </Layout>
  );
}
