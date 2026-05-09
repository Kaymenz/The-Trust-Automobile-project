import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon path issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── Custom marker icons ──────────────────────────────────────────────────────
function createPinIcon(color, borderColor, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${color}" stroke="${borderColor}" stroke-width="2"/>
    <text x="18" y="22" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="${borderColor}">${emoji}</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48],
  });
}

function createUserIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="14" fill="#2563EB" stroke="#fff" stroke-width="3"/>
    <circle cx="16" cy="16" r="6" fill="#fff"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// ── Decode OSRM polyline (polyline6 / polyline5) ─────────────────────────────
function decodePolyline(str, precision = 5) {
  let index = 0, lat = 0, lng = 0;
  const coords = [];
  const factor = Math.pow(10, precision);

  while (index < str.length) {
    let b, shift = 0, result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    shift = 0; result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);

    coords.push([lat / factor, lng / factor]);
  }
  return coords;
}

// ── Map sub-component: fits bounds ────────────────────────────────────────────
function MapBoundsUpdater({ items, getCoords }) {
  const map = useMap();
  useEffect(() => {
    if (items.length === 0) return;
    const coords = items
      .map(getCoords)
      .filter(c => c);
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [48, 48], maxZoom: 13 });
    }
  }, [items, map, getCoords]);
  return null;
}

// ── Map sub-component: animate route view ─────────────────────────────────────
function RouteView({ routeCoords, userPos, destPos }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords && routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      if (userPos) bounds.extend(userPos);
      if (destPos) bounds.extend(destPos);
      map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 15, duration: 1.2 });
    }
  }, [routeCoords, userPos, destPos, map]);
  return null;
}

// ── Main component ───────────────────────────────────────────────────────────
export default function NavigationMap({
  items = [],
  getCoords,       // (item) => [lat, lng] or null
  getIcon,         // (item) => L.Icon
  renderPopup,     // (item, { onNavigate }) => JSX
  loading = false,
  emptyMessage = 'No locations found.',
  legendItems = [],
}) {
  const mapRef = useRef(null);
  const [userPos, setUserPos] = useState(null);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // Ghana center as default map view
  const ghanaCenter = [7.9465, -1.0232];

  // mappable items
  const mappable = items.filter(item => {
    const c = getCoords(item);
    return c && c.length === 2;
  });

  // Get user location
  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(loc);
          setGeoError(null);
          resolve(loc);
        },
        (err) => {
          setGeoError('Could not get your location. Please enable GPS.');
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  // Fetch route from OSRM (free open source routing)
  const fetchRoute = useCallback(async (from, to) => {
    try {
      setRouteLoading(true);
      // OSRM public demo server — production should use own instance
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=polyline`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.code === 'Ok' && data.routes?.length > 0) {
        const route = data.routes[0];
        const decoded = decodePolyline(route.geometry);
        setRouteCoords(decoded);
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(1),
          duration: Math.ceil(route.duration / 60),
        });
      } else {
        // Fallback: straight line
        setRouteCoords([from, to]);
        setRouteInfo({
          distance: (L.latLng(from).distanceTo(L.latLng(to)) / 1000).toFixed(1),
          duration: '—',
        });
      }
    } catch (err) {
      console.error('Route fetch error:', err);
      // Fallback: straight line
      setRouteCoords([from, to]);
      const distKm = (L.latLng(from).distanceTo(L.latLng(to)) / 1000).toFixed(1);
      setRouteInfo({ distance: distKm, duration: '—' });
    } finally {
      setRouteLoading(false);
    }
  }, []);

  // Navigate to a destination
  const handleNavigate = useCallback(async (item) => {
    const destCoords = getCoords(item);
    if (!destCoords) return;

    setNavigatingTo(item);
    setRouteCoords(null);
    setRouteInfo(null);

    try {
      const from = await getUserLocation();
      await fetchRoute(from, destCoords);
    } catch {
      // If geolocation fails, zoom to destination anyway
      setRouteCoords(null);
    }
  }, [getCoords, getUserLocation, fetchRoute]);

  // Stop navigation
  const handleStopNavigation = useCallback(() => {
    setNavigatingTo(null);
    setRouteCoords(null);
    setRouteInfo(null);
  }, []);

  // Open in Google Maps for actual turn-by-turn
  const openInGoogleMaps = useCallback(() => {
    if (!navigatingTo) return;
    const dest = getCoords(navigatingTo);
    if (!dest) return;

    let url;
    if (userPos) {
      url = `https://www.google.com/maps/dir/${userPos[0]},${userPos[1]}/${dest[0]},${dest[1]}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${dest[0]},${dest[1]}`;
    }
    window.open(url, '_blank');
  }, [navigatingTo, userPos, getCoords]);

  return (
    <div>
      {/* Navigation panel */}
      {navigatingTo && (
        <div style={{
          background: 'linear-gradient(135deg, var(--navy-900), var(--navy-700))',
          borderRadius: 14,
          padding: 20,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--gold-500)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--navy-900)">
              <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/>
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-400)', marginBottom: 4 }}>
              {routeLoading ? 'CALCULATING ROUTE…' : 'NAVIGATING TO'}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>
              {navigatingTo.workshopName || navigatingTo.name || 'Destination'}
            </div>
            {routeInfo && (
              <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--slate-400)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                  {routeInfo.distance} km
                </span>
                <span style={{ fontSize: 13, color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--slate-400)"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                  {routeInfo.duration === '—' ? 'N/A' : `~${routeInfo.duration} min`}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn-primary"
              onClick={openInGoogleMaps}
              style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="var(--navy-900)"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z"/></svg>
              Open in Maps
            </button>
            <button
              onClick={handleStopNavigation}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, transition: 'all 0.15s',
              }}
              title="Stop navigation"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {geoError && !routeCoords && navigatingTo && (
        <div style={{
          background: 'var(--no-100)',
          border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 12,
          fontSize: 13,
          color: 'var(--no-600)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--no-600)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          {geoError}
          <button onClick={() => handleNavigate(navigatingTo)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--no-600)', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
            Retry
          </button>
        </div>
      )}

      {/* Map container */}
      <div className="mechanic-map-wrap" style={{ height: navigatingTo ? 480 : 560, transition: 'height 0.3s ease' }}>
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
            {!navigatingTo && <MapBoundsUpdater items={mappable} getCoords={getCoords} />}

            {/* Destination markers */}
            {mappable.map((item, idx) => (
              <Marker
                key={item._id || item.id || idx}
                position={getCoords(item)}
                icon={getIcon(item)}
              >
                <Popup>
                  {renderPopup(item, { onNavigate: () => handleNavigate(item) })}
                </Popup>
              </Marker>
            ))}

            {/* User location marker */}
            {userPos && navigatingTo && (
              <>
                <Marker position={userPos} icon={createUserIcon()}>
                  <Popup>
                    <div style={{ textAlign: 'center', padding: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy-900)' }}>Your Location</div>
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={userPos}
                  radius={80}
                  pathOptions={{
                    color: '#2563EB',
                    fillColor: '#2563EB',
                    fillOpacity: 0.12,
                    weight: 2,
                  }}
                />
              </>
            )}

            {/* Route polyline */}
            {routeCoords && routeCoords.length > 1 && (
              <>
                {/* Route shadow */}
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: 'rgba(11,29,53,0.25)',
                    weight: 8,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
                {/* Main route line */}
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: '#2563EB',
                    weight: 5,
                    lineCap: 'round',
                    lineJoin: 'round',
                  }}
                />
                {/* Animated direction dashes */}
                <Polyline
                  positions={routeCoords}
                  pathOptions={{
                    color: '#60A5FA',
                    weight: 3,
                    dashArray: '8 16',
                    lineCap: 'round',
                  }}
                />
                <RouteView
                  routeCoords={routeCoords}
                  userPos={userPos}
                  destPos={getCoords(navigatingTo)}
                />
              </>
            )}

            {/* Route loading indicator overlay */}
            {routeLoading && (
              <div style={{
                position: 'absolute',
                top: 16, left: '50%', transform: 'translateX(-50%)',
                zIndex: 1000,
                background: 'var(--navy-900)',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: 'var(--shadow-lg)',
              }}>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                Calculating route…
              </div>
            )}
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 12, color: 'var(--slate-500)', alignItems: 'center', flexWrap: 'wrap' }}>
        {legendItems.map((legend, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: legend.color, display: 'inline-block' }} />
            {legend.label}
          </span>
        ))}
        {userPos && navigatingTo && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
            Your Location
          </span>
        )}
        <span>Click a pin for details</span>
      </div>

      {mappable.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--slate-500)' }}>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="var(--slate-400)" style={{ display: 'block', margin: '0 auto 12px' }}>
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5z"/>
          </svg>
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export { createPinIcon };
