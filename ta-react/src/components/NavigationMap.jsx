import { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// ── Custom marker icons ──────────────────────────────────────────────────────
// Returns a plain data object describing the custom SVG icon
export function createPinIcon(color, borderColor, emoji) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 48" width="36" height="48">
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${color}" stroke="${borderColor}" stroke-width="2"/>
    <text x="18" y="22" text-anchor="middle" dominant-baseline="middle" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="${borderColor}">${emoji}</text>
  </svg>`;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    width: 36,
    height: 48,
    anchorX: 18,
    anchorY: 48
  };
}

function createUserIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <circle cx="16" cy="16" r="14" fill="#2563EB" stroke="#fff" stroke-width="3"/>
    <circle cx="16" cy="16" r="6" fill="#fff"/>
  </svg>`;
  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    width: 32,
    height: 32,
    anchorX: 16,
    anchorY: 16
  };
}

// ── Google Maps Custom Navy Styling ──────────────────────────────────────────
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#080A0F" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#080A0F" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#E5E7EB" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#D4AF37" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9CA3AF" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#0E121A" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9CA3AF" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#141A24" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1C2330" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9CA3AF" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1C2330" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#C5A059" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#D4AF37" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#050608" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9CA3AF" }],
  },
];

// ── Main component ───────────────────────────────────────────────────────────
export default function NavigationMap({
  items = [],
  getCoords,       // (item) => [lat, lng] or null
  getIcon,         // (item) => IconData object
  renderPopup,     // (item, { onNavigate }) => JSX
  loading = false,
  emptyMessage = 'No locations found.',
  legendItems = [],
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  
  // Script loading state
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Geolocation & Navigation States
  const [userPos, setUserPos] = useState(null);
  const [navigatingTo, setNavigatingTo] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  // References for cleanup
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const polylinesRef = useRef([]);
  const animationIntervalRef = useRef(null);
  const currentInfoWindowRef = useRef(null);
  const directionsServiceRef = useRef(null);

  // Ghana center as default map view
  const ghanaCenter = { lat: 7.9465, lng: -1.0232 };

  // Mappable items
  const mappable = items.filter(item => {
    const c = getCoords(item);
    return c && c.length === 2;
  });

  // 1. Dynamic Script Loader for Google Maps
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBiuUrIx-g0kpEKR-2lY5PgeOctgr6hnsE';
    const existingScript = document.getElementById('google-maps-script');
    
    if (existingScript) {
      const handleLoad = () => setMapLoaded(true);
      existingScript.addEventListener('load', handleLoad);
      return () => {
        existingScript.removeEventListener('load', handleLoad);
      };
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 2. Initialize the Google Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || mapRef.current) return;

    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: ghanaCenter,
      zoom: 7,
      styles: mapStyles,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    
    mapRef.current = map;
    directionsServiceRef.current = new window.google.maps.DirectionsService();
  }, [mapLoaded]);

  // 3. Geolocation Helper
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

  // 4. Handle Navigation Trigger
  const handleNavigate = useCallback(async (item) => {
    const destCoords = getCoords(item);
    if (!destCoords) return;

    setNavigatingTo(item);
    setRouteInfo(null);

    try {
      await getUserLocation();
    } catch {
      // Allow proceeding even if user location fails
    }
  }, [getCoords, getUserLocation]);

  // 5. Stop Navigation
  const handleStopNavigation = useCallback(() => {
    setNavigatingTo(null);
    setRouteInfo(null);
    setUserPos(null);
  }, []);

  // 6. Open in Google Maps for actual turn-by-turn
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

  // Helper to construct a Google Maps marker icon configuration
  const makeGoogleIcon = (iconData) => {
    if (!iconData || !iconData.url) return null;
    return {
      url: iconData.url,
      size: new window.google.maps.Size(iconData.width, iconData.height),
      scaledSize: new window.google.maps.Size(iconData.width, iconData.height),
      anchor: new window.google.maps.Point(iconData.anchorX, iconData.anchorY),
    };
  };

  // Helper to render popup React component inside InfoWindow
  const setupInfoWindow = (marker, item) => {
    let root = null;
    const infoWindow = new window.google.maps.InfoWindow();
    
    marker.addListener('click', () => {
      if (currentInfoWindowRef.current) {
        currentInfoWindowRef.current.close();
      }
      currentInfoWindowRef.current = infoWindow;
      
      const container = document.createElement('div');
      root = createRoot(container);
      root.render(renderPopup(item, { onNavigate: () => {
        infoWindow.close();
        handleNavigate(item);
      }}));
      
      infoWindow.setContent(container);
      infoWindow.open(mapRef.current, marker);
    });

    infoWindow.addListener('closeclick', () => {
      if (root) {
        root.unmount();
        root = null;
      }
    });
  };

  // 7. Render Markers, Circles, Route Polylines
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;

    // Clear previous markers
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    // Clear previous circles
    circlesRef.current.forEach(c => c.setMap(null));
    circlesRef.current = [];

    // Clear previous polylines & animation intervals
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    if (navigatingTo) {
      const destCoords = getCoords(navigatingTo);
      if (!destCoords) return;

      // Draw ONLY the destination marker (removes all other pins!)
      const destIcon = makeGoogleIcon(getIcon(navigatingTo));
      const destMarker = new window.google.maps.Marker({
        position: { lat: destCoords[0], lng: destCoords[1] },
        map: map,
        icon: destIcon,
        zIndex: 10,
      });
      setupInfoWindow(destMarker, navigatingTo);
      markersRef.current.push(destMarker);

      // Draw User marker, circle, and route if userPos is active
      if (userPos) {
        const userIcon = makeGoogleIcon(createUserIcon());
        const userMarker = new window.google.maps.Marker({
          position: { lat: userPos[0], lng: userPos[1] },
          map: map,
          icon: userIcon,
          title: "Your Location",
          zIndex: 10,
        });
        markersRef.current.push(userMarker);

        const userCircle = new window.google.maps.Circle({
          map: map,
          center: { lat: userPos[0], lng: userPos[1] },
          radius: 80,
          fillColor: '#D4AF37',
          fillOpacity: 0.12,
          strokeColor: '#D4AF37',
          strokeOpacity: 0.8,
          strokeWeight: 2,
        });
        circlesRef.current.push(userCircle);

        // Fetch directions and draw custom styled polylines
        setRouteLoading(true);
        directionsServiceRef.current.route({
          origin: { lat: userPos[0], lng: userPos[1] },
          destination: { lat: destCoords[0], lng: destCoords[1] },
          travelMode: window.google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          setRouteLoading(false);
          if (status === window.google.maps.DirectionsStatus.OK) {
            const leg = result.routes[0].legs[0];
            setRouteInfo({
              distance: (leg.distance.value / 1000).toFixed(1),
              duration: Math.ceil(leg.duration.value / 60),
            });

            const path = result.routes[0].overview_path;

            // Draw route shadow
            const shadowLine = new window.google.maps.Polyline({
              path: path,
              strokeColor: 'rgba(8, 10, 15, 0.4)',
              strokeOpacity: 1.0,
              strokeWeight: 8,
              map: map,
            });
            polylinesRef.current.push(shadowLine);

            // Draw main route line
            const mainLine = new window.google.maps.Polyline({
              path: path,
              strokeColor: '#C5A059',
              strokeOpacity: 0.8,
              strokeWeight: 5,
              map: map,
            });
            polylinesRef.current.push(mainLine);

            // Draw animated dash overlay
            const dashLine = new window.google.maps.Polyline({
              path: path,
              strokeColor: '#E5C158',
              strokeOpacity: 0.0,
              strokeWeight: 3,
              icons: [{
                icon: {
                  path: 'M 0,-1.5 0,1.5',
                  strokeOpacity: 1.0,
                  scale: 3,
                  strokeColor: '#E5C158',
                  strokeWeight: 3,
                },
                offset: '0px',
                repeat: '20px',
              }],
              map: map,
            });
            polylinesRef.current.push(dashLine);

            // Start dash animation
            let offset = 0;
            const intervalId = setInterval(() => {
              offset = (offset + 1) % 20;
              const icons = dashLine.get('icons');
              if (icons && icons[0]) {
                icons[0].offset = offset + 'px';
                dashLine.set('icons', icons);
              }
            }, 50);
            animationIntervalRef.current = intervalId;

            // Fit map bounds to show full route path
            const bounds = new window.google.maps.LatLngBounds();
            path.forEach(latLng => bounds.extend(latLng));
            map.fitBounds(bounds);
          } else {
            console.error('Route calculation failed: ', status);
          }
        });
      } else {
        // Fallback zoom on target only
        map.setCenter({ lat: destCoords[0], lng: destCoords[1] });
        map.setZoom(14);
      }
    } else {
      // Not navigating: show ALL markers & fit bounds
      const bounds = new window.google.maps.LatLngBounds();
      let hasCoords = false;

      mappable.forEach(item => {
        const coords = getCoords(item);
        const iconData = getIcon(item);

        const marker = new window.google.maps.Marker({
          position: { lat: coords[0], lng: coords[1] },
          map: map,
          icon: makeGoogleIcon(iconData),
        });

        setupInfoWindow(marker, item);
        markersRef.current.push(marker);
        
        bounds.extend(new window.google.maps.LatLng(coords[0], coords[1]));
        hasCoords = true;
      });

      if (hasCoords) {
        map.fitBounds(bounds);
      } else {
        map.setCenter(ghanaCenter);
        map.setZoom(7);
      }
    }
  }, [mapLoaded, navigatingTo, userPos, items]);

  // 8. Cleanup ref values on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      circlesRef.current.forEach(c => c.setMap(null));
      polylinesRef.current.forEach(p => p.setMap(null));
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

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

      {geoError && !routeInfo && navigatingTo && (
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
        {loading || !mapLoaded ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--slate-50)' }}>
            <div style={{ textAlign: 'center', color: 'var(--slate-500)' }}>
              <div className="spinner" style={{ marginBottom: 12 }} />
              <p>Loading map…</p>
            </div>
          </div>
        ) : (
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
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
