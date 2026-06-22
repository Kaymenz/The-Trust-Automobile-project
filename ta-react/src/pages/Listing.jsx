import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function BookingModal({ type, car, onClose, onSuccess }) {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isTestDrive = type === 'test_drive';
  const title = isTestDrive ? 'Request Test Drive' : 'Confirm Purchase Interest';
  const vehicleDetails = `${car.make} ${car.model} ${car.year}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isTestDrive) {
        await api.requestTestDrive({
          listingId: car._id || car.id,
          vehicleDetails,
          preferredDate: preferredDate || undefined,
          preferredTime: preferredTime || undefined,
          message: `Test drive request for ${vehicleDetails}.`,
        });
      } else {
        await api.requestPurchase({
          listingId: car._id || car.id,
          vehicleDetails,
          totalPrice: car.price,
          message: `Purchase interest for ${vehicleDetails}.`,
        });
      }
      onSuccess(type);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Minimum date = tomorrow
  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: 'var(--navy-900)' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--slate-500)' }}>✕</button>
        </div>

        {/* Vehicle summary */}
        <div style={{
          background: 'linear-gradient(135deg, var(--navy-900), var(--navy-700))',
          borderRadius: 12, padding: 16, marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: 'var(--gold-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i className={`bi ${isTestDrive ? 'bi-car-front-fill' : 'bi-bag-check-fill'}`} style={{ fontSize: 20, color: 'var(--navy-900)' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{vehicleDetails}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gold-400)', fontFamily: "'Playfair Display', serif" }}>
              GHS {(car.price || 0).toLocaleString()}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {isTestDrive && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Preferred Date</label>
                <input type="date" min={minDate} value={preferredDate} onChange={e => setPreferredDate(e.target.value)} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Preferred Time</label>
                <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)}>
                  <option value="">Select time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>
            </div>
          )}

          <div style={{
            background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.2)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 18,
            fontSize: 12, color: 'var(--navy-700)', lineHeight: 1.6,
          }}>
            <i className="bi bi-info-circle" style={{ color: 'var(--gold-600)', marginRight: 6 }} />
            {isTestDrive
              ? 'The seller will be notified and will contact you via your registered email to confirm the date and location.'
              : 'By confirming, you\'re expressing interest to purchase. The seller will contact you via your registered details to arrange payment and transfer. No money is charged now.'}
          </div>

          {error && (
            <div style={{
              background: 'var(--no-100)', border: '1px solid rgba(220,38,38,0.2)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 14,
              fontSize: 13, color: 'var(--no-600)',
            }}>
              <i className="bi bi-exclamation-circle" style={{ marginRight: 6 }} />{error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px 24px', fontSize: 14 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Processing...
              </span>
            ) : isTestDrive ? (
              <>
                <i className="bi bi-calendar-check" style={{ marginRight: 8 }} />
                Request Test Drive
              </>
            ) : (
              <>
                <i className="bi bi-bag-check" style={{ marginRight: 8 }} />
                Confirm Purchase Interest
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function SuccessModal({ type, car, onClose, onDashboard }) {
  const isTestDrive = type === 'test_drive';
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--yes-500), var(--yes-600))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <i className="bi bi-check-lg" style={{ fontSize: 32, color: '#fff' }} />
        </div>
        <h3 style={{ margin: '0 0 8px', color: 'var(--navy-900)', fontSize: 18 }}>
          {isTestDrive ? 'Test Drive Requested!' : 'Purchase Request Sent!'}
        </h3>
        <p style={{ color: 'var(--slate-600)', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
          {isTestDrive
            ? `Your test drive request for the ${car.make} ${car.model} ${car.year} has been submitted. The seller will contact you to confirm.`
            : `Your purchase interest for the ${car.make} ${car.model} ${car.year} has been registered. The seller will reach out to finalize the deal.`
          }
        </p>
        <p style={{ color: 'var(--slate-500)', fontSize: 12, marginBottom: 20 }}>
          You can track all your bookings from your dashboard.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>Back to Listing</button>
          <button className="btn-primary" onClick={onDashboard} style={{ flex: 1 }}>
            <i className="bi bi-grid" style={{ marginRight: 6 }} />Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Listing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isSaved, toggleSave } = useAuth();
  const { showToast } = useToast();
  const [modal, setModal] = useState(null); // null | 'test_drive' | 'purchase'
  const [successType, setSuccessType] = useState(null);

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
    if (id) fetchCar();
  }, [id]);

  const handleAction = (type) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setModal(type);
  };

  const handleSuccess = (type) => {
    setModal(null);
    setSuccessType(type);
  };

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
                <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=60" alt={`${car.make} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              {car.condition && <span className="gallery-badge">{car.condition}</span>}
              <button className={`gallery-save ${saved ? 'saved' : ''}`} onClick={() => toggleSave(carId).catch(() => showToast('Failed to save car. Please try again.', 'error'))}>
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

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => handleAction('purchase')} style={{ flex: 1, minWidth: 180, padding: '12px 20px', fontSize: 14 }}>
                <i className="bi bi-bag-check" style={{ marginRight: 8 }} />Buy This Car — GHS {(car.price || 0).toLocaleString()}
              </button>
              <button className="btn-secondary" onClick={() => handleAction('test_drive')} style={{ padding: '12px 20px', fontSize: 14 }}>
                <i className="bi bi-car-front" style={{ marginRight: 8 }} />Request Test Drive
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button className="btn-secondary" style={{ flex: 1 }}>
                <i className="bi bi-telephone" style={{ marginRight: 6 }} />Contact Seller
              </button>
              <button className="btn-secondary" style={{ flex: 1 }}>
                <i className="bi bi-chat-dots" style={{ marginRight: 6 }} />Send Message
              </button>
            </div>
          </div>
        </div>

        <div>
          {/* Price card */}
          <div className="seller-card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--navy-900), var(--navy-700))' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 6 }}>ASKING PRICE</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>
              GHS {(car.price || 0).toLocaleString()}
            </div>
            {car.negotiable && <div style={{ fontSize: 12, color: 'var(--gold-300)' }}>Negotiable</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn-primary" onClick={() => handleAction('purchase')} style={{ flex: 1, fontSize: 13 }}>
                Buy Now
              </button>
              <button
                className="btn-secondary"
                onClick={() => handleAction('test_drive')}
                style={{ flex: 1, fontSize: 13, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
              >
                Test Drive
              </button>
            </div>
          </div>

          <div className="seller-card">
            <h4>Seller Information</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #1a4b8c, #e8a020)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>TA</div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>Trust Automobile</div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)' }}>Verified Dealer</div>
              </div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--slate-600)', marginBottom: 8 }}><i className="bi bi-geo-alt" /> Accra, Ghana</div>
            <div style={{ fontSize: 14, color: 'var(--slate-600)', marginBottom: 16 }}><i className="bi bi-clock" /> Member since 2024</div>
          </div>

          <div className="seller-card" style={{ marginTop: 20 }}>
            <h4>Safety Tips</h4>
            <ul style={{ fontSize: 13, color: 'var(--slate-600)', lineHeight: 2, paddingLeft: 16 }}>
              <li>Meet in a safe, public place</li>
              <li>Check the car thoroughly before paying</li>
              <li>Use escrow for large payments</li>
              <li>Verify documents and service history</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {modal && (
        <BookingModal
          type={modal}
          car={car}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* Success Modal */}
      {successType && (
        <SuccessModal
          type={successType}
          car={car}
          onClose={() => setSuccessType(null)}
          onDashboard={() => navigate('/dashboard')}
        />
      )}
    </Layout>
  );
}
