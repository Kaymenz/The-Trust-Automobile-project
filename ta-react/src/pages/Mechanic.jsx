import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../components/Layout';
import { api } from '../utils/api';
import { MechanicCardSkeleton } from '../components/SkeletonLoader';

// Fix leaflet default icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createMechanicIcon(status) {
  const color = status === 'active' ? '#E8A828' : '#94A3B8';
  const borderColor = status === 'active' ? '#0B1D35' : '#475569';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${color}" stroke="${borderColor}" stroke-width="2"/>
    <text x="18" y="22" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="${borderColor}">⚙</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48],
  });
}

function MapBoundsUpdater({ mechanics }) {
  const map = useMap();
  useEffect(() => {
    if (mechanics.length === 0) return;
    const coords = mechanics
      .filter(m => m.location && m.location.length === 2)
      .map(m => [m.location[1], m.location[0]]);
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [48, 48], maxZoom: 13 });
    }
  }, [mechanics, map]);
  return null;
}

export default function Mechanic() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'map'
  const [mechanics, setMechanics] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const mapRef = useRef(null);

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

  // mechanics that have valid GPS coordinates
  const mappable = mechanics.filter(m => m.location && m.location.length === 2);

  // Ghana center as default map view
  const ghanaCenter = [7.9465, -1.0232];

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
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Book Now</button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '7px 16px', fontSize: 13 }}
                          onClick={() => { setSelectedMechanic(m._id); setView('map'); }}
                        >
                          <i className="bi bi-map" /> View on Map
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* MAP VIEW */}
        {!error && view === 'map' && (
          <div>
            <div className="mechanic-map-wrap" style={{ height: 560 }}>
              {loading ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
                  <div style={{ textAlign: 'center', color: 'var(--slate-500)' }}>
                    <div className="spinner" style={{ marginBottom: 12 }} />
                    <p>Loading map…</p>
                  </div>
                </div>
              ) : (
                <MapContainer
                  center={ghanaCenter}
                  zoom={7}
                  style={{ width: '100%', height: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapBoundsUpdater mechanics={mappable} />
                  {mappable.map(m => (
                    <Marker
                      key={m._id}
                      position={[m.location[1], m.location[0]]}
                      icon={createMechanicIcon(m.status)}
                    >
                      <Popup>
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
                          <button
                            className="btn-primary map-popup-btn"
                            onClick={() => { setSelectedMechanic(m._id); setView('list'); }}
                          >
                            Book Now
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              )}
            </div>

            {/* Map legend */}
            <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 12, color: 'var(--slate-500)', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#E8A828', display: 'inline-block' }} />
                Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#94A3B8', display: 'inline-block' }} />
                Unavailable / Busy
              </span>
              <span>Click a pin for details</span>
            </div>

            {mappable.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--slate-500)' }}>
                <i className="bi bi-map" style={{ fontSize: 36, display: 'block', marginBottom: 12 }} />
                No mechanics with map locations found. Try clearing your search filters.
              </div>
            )}
          </div>
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
    </Layout>
  );
}
