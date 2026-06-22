import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import NavigationMap, { createPinIcon } from '../components/NavigationMap';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MechanicCardSkeleton } from '../components/SkeletonLoader';

function MechanicBookingModal({ mechanic, onClose, onSuccess }) {
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleDetails || !preferredDate || !preferredTime) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.requestService({
        mechanicId: mechanic._id || mechanic.id,
        vehicleDetails,
        preferredDate,
        preferredTime,
        phone,
        message,
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to book service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: 'var(--slate-900)' }}>Book Service Appointment</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--slate-500)' }}>✕</button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, var(--navy-900), var(--navy-700))',
          borderRadius: 12, padding: 16, marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: 'var(--gold-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <i className="bi bi-tools" style={{ fontSize: 18, color: 'var(--navy-900)' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{mechanic.workshopName || mechanic.user?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--gold-300)' }}>{mechanic.city}, Ghana</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Vehicle (Make, Model, Year) *</label>
            <input
              type="text"
              placeholder="e.g. Toyota Camry 2018"
              value={vehicleDetails}
              onChange={e => setVehicleDetails(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Preferred Date *</label>
              <input type="date" min={minDate} value={preferredDate} onChange={e => setPreferredDate(e.target.value)} required />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Preferred Time *</label>
              <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)} required>
                <option value="">Select time</option>
                <option value="08:00 AM">08:00 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+233 24 XXX XXXX"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <label>Issue Description / Notes</label>
            <textarea
              rows={3}
              placeholder="Briefly describe the service needed or issue..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{ resize: 'vertical' }}
            />
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
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}

function createMechanicIcon(status) {
  const color = status === 'active' ? '#E8A828' : '#94A3B8';
  const borderColor = status === 'active' ? '#0B1D35' : '#475569';
  return createPinIcon(color, borderColor, '⚙');
}

export default function Mechanic() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'map'
  const [mechanics, setMechanics] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [success, setSuccess] = useState(false);

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
    api.getMechanicSpecializations()
      .then(setSpecializations)
      .catch(() => {});
  }, []);

  const handleBook = (mechanic) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedMechanic(mechanic);
  };

  const handleSuccess = () => {
    setSelectedMechanic(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  // mechanics that have valid GPS coordinates
  const mappable = mechanics.filter(m => m.location && m.location.length === 2);

  // Coordinate getter for NavigationMap
  const getCoords = (m) => {
    if (!m.location || m.location.length !== 2) return null;
    return [m.location[1], m.location[0]]; // [lat, lng]
  };

  return (
    <Layout activePage="mechanic">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span>Find a Mechanic</span>
          </div>
          <h1>Find a Mechanic</h1>
          <p>Connect with verified automotive professionals across Ghana</p>
        </div>
      </div>

      <section className="section">
        {success && (
          <div style={{
            background: 'var(--yes-100)', border: '1.5px solid var(--yes-300)',
            borderRadius: 12, padding: '16px 20px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeInDown 0.3s ease'
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--yes-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <i className="bi bi-check" style={{ fontSize: 24 }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--yes-700)' }}>Booking Successful!</div>
              <div style={{ fontSize: 13, color: 'var(--yes-600)' }}>Your appointment has been requested. Check your dashboard for updates.</div>
            </div>
            <button onClick={() => setSuccess(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--yes-700)', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Controls bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--slate-200)', borderRadius: 8, fontSize: 14, minWidth: 220 }}
          />
          <select
            value={specialty}
            onChange={e => setSpecialty(e.target.value)}
            style={{ padding: '10px 14px', border: '1.5px solid var(--slate-200)', borderRadius: 8, fontSize: 14 }}
          >
            <option value="">All Specialties</option>
            {specializations.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* List / Map toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn${view === 'list' ? ' active' : ''}`}
              onClick={() => setView('list')}
            >
              <i className="bi bi-grid-3x2-gap" /> List
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
        </div>

        {/* Results count */}
        {!loading && !error && (
          <div style={{ fontSize: 13, color: 'var(--slate-500)', marginBottom: 20 }}>
            {mechanics.length} mechanic{mechanics.length !== 1 ? 's' : ''} found
            {view === 'map' && mappable.length < mechanics.length && (
              <span style={{ marginLeft: 8, color: 'var(--gold-700)' }}>
                ({mechanics.length - mappable.length} without map location)
              </span>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: 'center', padding: 60, color: '#dc3545' }}>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()} style={{ marginTop: 16 }}>Retry</button>
          </div>
        )}

        {/* LIST VIEW */}
        {!error && view === 'list' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <MechanicCardSkeleton key={i} />)
              : mechanics.map(m => (
                  <div key={m._id} className="form-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', margin: 0 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 12,
                      background: 'linear-gradient(135deg, var(--navy-700), var(--navy-500))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <i className="bi bi-tools" style={{ fontSize: 22, color: 'var(--gold-400)' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: 15 }}>
                          {m.workshopName || m.user?.name || 'Workshop'}
                        </span>
                        {m.status === 'active' && <span className="badge badge-green">Available</span>}
                        {m.mobileService && <span className="badge badge-blue" title="Comes to you">Mobile</span>}
                        {m.emergencyService && <span className="badge badge-red" title="24/7 emergency">24/7</span>}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--navy-600)', fontWeight: 600, marginBottom: 4 }}>
                        {m.specializations?.slice(0, 3).join(' · ') || 'General auto services'}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--slate-500)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span><i className="bi bi-geo-alt" /> {m.city || 'Ghana'}</span>
                        {m.yearsOfExperience > 0 && <span><i className="bi bi-clock" /> {m.yearsOfExperience}yrs exp</span>}
                        <span>
                          <i className="bi bi-star-fill" style={{ color: '#E8A020' }} /> {(m.rating || 0).toFixed(1)}
                          <span style={{ color: 'var(--slate-400)', marginLeft: 2 }}>({m.reviewCount || 0})</span>
                        </span>
                      </div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => handleBook(m)}>Book Now</button>
                        {m.location && m.location.length === 2 && (
                          <button
                            className="btn-secondary"
                            style={{ padding: '7px 16px', fontSize: 13 }}
                            onClick={() => setView('map')}
                          >
                            <i className="bi bi-map" /> View on Map
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* MAP VIEW */}
        {!error && view === 'map' && (
          <NavigationMap
            items={mechanics}
            loading={loading}
            getCoords={getCoords}
            getIcon={(m) => createMechanicIcon(m.status)}
            emptyMessage="No mechanics with map locations found. Try clearing your search filters."
            legendItems={[
              { color: '#E8A828', label: 'Available' },
              { color: '#94A3B8', label: 'Unavailable / Busy' },
            ]}
            renderPopup={(m, { onNavigate }) => (
              <div className="map-popup">
                <div className="map-popup-name">{m.workshopName || m.user?.name}</div>
                <div className="map-popup-spec">{m.specializations?.slice(0, 2).join(' · ')}</div>
                <div className="map-popup-loc">
                  <i className="bi bi-geo-alt" /> {m.address}, {m.city}
                </div>
                <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 4 }}>
                  <i className="bi bi-star-fill" style={{ color: '#E8A020' }} /> {(m.rating || 0).toFixed(1)} · {m.reviewCount || 0} reviews
                </div>
                {(m.mobileService || m.emergencyService) && (
                  <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
                    {m.mobileService && <span className="badge badge-blue" style={{ fontSize: 10 }}>Mobile</span>}
                    {m.emergencyService && <span className="badge badge-red" style={{ fontSize: 10 }}>24/7</span>}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <button className="btn-primary" style={{ flex: 1, padding: '7px 12px', fontSize: 12 }} onClick={() => handleBook(m)}>
                    Book Now
                  </button>
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

        {/* Empty state for list view */}
        {!loading && !error && view === 'list' && mechanics.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--slate-500)' }}>
            <i className="bi bi-tools" style={{ fontSize: 40, display: 'block', marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>No mechanics found</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Try adjusting your search or specialty filter</p>
          </div>
        )}
      </section>

      {selectedMechanic && (
        <MechanicBookingModal
          mechanic={selectedMechanic}
          onClose={() => setSelectedMechanic(null)}
          onSuccess={handleSuccess}
        />
      )}
    </Layout>
  );
}
