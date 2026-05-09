export function CarCardSkeleton() {
  return (
    <div className="skel-card">
      <div className="skel-img" />
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
