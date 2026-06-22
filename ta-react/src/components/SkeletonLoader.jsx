export function CarCardSkeleton() {
  return (
    <div className="skel-card">
      <div className="skel-img" style={{ position: 'relative' }}>
        <svg
          viewBox="0 0 280 180"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
          aria-hidden="true"
        >
          <path d="M30 130L42 95L65 72L110 60L160 58L205 65L232 85L254 100L262 130H30Z" fill="white"/>
          <path d="M68 72L82 42H170L192 72H68Z" fill="white" opacity="0.85"/>
          <circle cx="78" cy="132" r="24" fill="white"/>
          <circle cx="200" cy="132" r="24" fill="white"/>
          <circle cx="78" cy="132" r="12" fill="currentColor" opacity="0.3"/>
          <circle cx="200" cy="132" r="12" fill="currentColor" opacity="0.3"/>
          <path d="M20 128H268" stroke="white" strokeWidth="3" strokeOpacity="0.4"/>
        </svg>
      </div>
      <div className="skel-body">
        <div className="skel-line xshort" style={{ marginBottom: 6 }} />
        <div className="skel-line" />
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div className="skel-line xshort" style={{ flex: 1, marginBottom: 0 }} />
          <div className="skel-line xshort" style={{ flex: 1, marginBottom: 0 }} />
          <div className="skel-line xshort" style={{ flex: 1, marginBottom: 0 }} />
        </div>
        <div style={{ height: 1, background: 'var(--slate-100)', marginBottom: 12 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skel-line" style={{ width: 100, marginBottom: 0 }} />
          <div className="skel-line xshort" style={{ width: 70, marginBottom: 0 }} />
        </div>
      </div>
    </div>
  );
}

export function MechanicCardSkeleton() {
  return (
    <div className="skel-mechanic">
      <div className="skel-avatar" />
      <div style={{ flex: 1 }}>
        <div className="skel-line" style={{ width: '55%' }} />
        <div className="skel-line short" />
        <div className="skel-line xshort" />
        <div className="skel-actions">
          <div className="skel-btn" style={{ width: 90 }} />
          <div className="skel-btn" style={{ width: 90 }} />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="dash-stat-card">
      <div className="skel-line xshort" style={{ marginBottom: 12 }} />
      <div className="skel-line" style={{ height: 32, width: 80 }} />
      <div className="skel-line xshort" style={{ marginTop: 8 }} />
    </div>
  );
}
