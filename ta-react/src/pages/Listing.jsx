import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Listing() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSaved, toggleSave } = useAuth();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const data = await api.getListing(id);
        setCar(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch listing:', err);
        setError('Failed to load car details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  if (loading) return (
    <Layout activePage="">
      <div style={{ textAlign: 'center', padding: 100 }}>
        <div className="spinner" style={{ marginBottom: 16 }}></div>
        <p>Loading car details...</p>
      </div>
    </Layout>
  );

  if (error || !car) return (
    <Layout activePage="">
      <div style={{ textAlign: 'center', padding: 100 }}>
        <h2>{error || 'Car not found'}</h2>
        <Link to="/search" className="btn-primary" style={{ marginTop: 20 }}>Browse Cars</Link>
      </div>
    </Layout>
  );

  const carId = car._id || car.id;
  const saved = isSaved(carId);

  return (
    <Layout activePage="">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="breadcrumb-sep">›</span>
            <Link to="/search">Search</Link><span className="breadcrumb-sep">›</span>
            <span>{car.make} {car.model}</span>
          </div>
          <h1>{car.make} {car.model} {car.year}</h1>
          <p>{car.condition} car in {car.location}</p>
        </div>
      </div>

      <div className="listing-layout">
        <div>
          <div className="gallery">
            <div className="gallery-main">
              {car.images?.[0] ? (
                <img src={car.images[0]} alt={`${car.make} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg viewBox="0 0 24 24"><path d="M5 11L6.5 6.5H17.5L19 11M17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16M6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16M18.92 6C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6L3 12V20H5V21H7V20H17V21H19V20H21V12L18.92 6Z"/></svg>
              )}
              {car.condition && <span className="gallery-badge">{car.condition}</span>}
              <button className={`gallery-save ${saved ? 'saved' : ''}`} onClick={() => toggleSave(carId)}>
                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
            </div>
          </div>

          <div className="listing-info">
            <div className="listing-make">{car.make}</div>
            <div className="listing-title">{car.model} {car.year}</div>
            <div className="listing-specs">
              <div className="listing-spec"><svg viewBox="0 0 24 24"><path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z"/></svg>{(car.mileage || 0).toLocaleString()} km</div>
              <div className="listing-spec"><svg viewBox="0 0 24 24"><path d="M19.77 7.23L19.78 7.22L16.06 3.5L15 4.56L17.11 6.67C16.17 7.03 15.5 7.93 15.5 9C15.5 10.38 16.62 11.5 18 11.5C18.36 11.5 18.69 11.42 19 11.29V18.5C19 19.05 18.55 19.5 18 19.5S17 19.05 17 18.5V14C17 12.9 16.1 12 15 12H14V5C14 3.9 13.1 3 12 3H6C4.9 3 4 3.9 4 5V21H14V13.5H15.5V18.5C15.5 19.88 16.62 21 18 21S20.5 19.88 20.5 18.5V9C20.5 8.31 20.22 7.68 19.77 7.23M12 10H6V5H12V10Z"/></svg>{car.fuelType || car.fuel}</div>
              <div className="listing-spec"><svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4M9 9V15L15 12L9 9Z"/></svg>{car.transmission}</div>
              <div className="listing-spec"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/></svg>{car.location}</div>
              <div className="listing-spec"><svg viewBox="0 0 24 24"><path d="M11 15H6L7 8H11V15M11 15H18V8H11V15M21.7 14.6L19.6 7.8C19.4 7.3 19 7 18.5 7H5.5C5 7 4.6 7.3 4.4 7.8L2.3 14.6C2.1 15.1 2.5 15.7 3 15.7H21C21.5 15.7 21.9 15.1 21.7 14.6Z"/></svg>{car.condition}</div>
            </div>
            <div className="listing-desc">{car.description || car.desc || 'No description available.'}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary"><i className="bi bi-telephone"></i> Contact Seller</button>
              <button className="btn-secondary"><i className="bi bi-chat-dots"></i> Send Message</button>
            </div>
          </div>
        </div>

        <div>
          <div className="seller-card">
            <h4>Seller Information</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4b8c, #e8a020)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>TA</div>
              <div>
                <div style={{ fontWeight: 600, color: '#0B1E3D' }}>Trust Automobile</div>
                <div style={{ fontSize: 12, color: '#8FA3BD' }}>Verified Dealer</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#5E7490', marginBottom: 8 }}><i className="bi bi-geo-alt"></i> Accra, Ghana</div>
            <div style={{ fontSize: 14, color: '#5E7490', marginBottom: 16 }}><i className="bi bi-clock"></i> Member since 2024</div>
            <button className="btn-primary" style={{ width: '100%' }}>Request Test Drive</button>
          </div>

          <div className="seller-card" style={{ marginTop: 20 }}>
            <h4>Safety Tips</h4>
            <ul style={{ fontSize: 13, color: '#5E7490', lineHeight: 2, paddingLeft: 16 }}>
              <li>Meet in a safe, public place</li>
              <li>Check the car thoroughly before paying</li>
              <li>Use escrow for large payments</li>
              <li>Verify documents and service history</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
