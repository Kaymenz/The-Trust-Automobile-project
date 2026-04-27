import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const MODELS = {
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'Hilux', 'Yaris'],
  Honda: ['Civic', 'Accord', 'CR-V', 'HR-V'],
  Ford: ['Ranger', 'Explorer', 'EcoSport', 'F-150'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  Hyundai: ['Tucson', 'Santa Fe', 'Elantra', 'Creta'],
  Kia: ['Sportage', 'Seltos', 'Sorento', 'Cerato'],
  Nissan: ['X-Trail', 'Patrol', 'Sentra', 'Kicks'],
  Volkswagen: ['Tiguan', 'Golf', 'Polo', 'T-Roc'],
};

export default function PostAd() {
  const [form, setForm] = useState({ make: '', model: '', year: '', condition: '', fuel: '', transmission: '', price: '', mileage: '', location: '', desc: '' });
  const [progress, setProgress] = useState(20);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const filled = Object.values(form).filter(v => v).length + images.length;
    setProgress(Math.min(100, Math.round((filled / 10) * 100)));
  }, [form, images]);

  const update = (field, val) => {
    const next = { ...form, [field]: val };
    setForm(next);
  };

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const max = 10;
    const allowed = files.slice(0, Math.max(0, max - images.length));
    allowed.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, { id: uid(), name: file.name, url: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (id) => {
    setImages(prev => prev.filter(i => i.id !== id));
  };

  return (
    <Layout activePage="post">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span>Post an Ad</span>
          </div>
          <h1>Post Your Car Ad</h1>
          <p>Reach thousands of buyers across Ghana — it's free</p>
        </div>
      </div>

      <div className="post-layout">
        <div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>

          <div className="form-card">
            <h3>Car Details</h3>
            <p className="card-sub">Tell buyers about your car</p>
            <div className="form-grid-2 mb-16">
              <div className="form-group">
                <label>Make *</label>
                <select value={form.make} onChange={e => update('make', e.target.value)}>
                  <option value="">Select Make</option>
                  {Object.keys(MODELS).map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Model *</label>
                <select value={form.model} onChange={e => update('model', e.target.value)}>
                  <option value="">Select Model</option>
                  {form.make && MODELS[form.make]?.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div className="form-grid-3 mb-16">
              <div className="form-group"><label>Year *</label>
                <select value={form.year} onChange={e => update('year', e.target.value)}>
                  <option value="">Year</option>
                  {Array.from({ length: 37 }, (_, i) => 2026 - i).map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Condition *</label>
                <select value={form.condition} onChange={e => update('condition', e.target.value)}>
                  <option value="">Select</option><option>New</option><option>Used</option>
                </select>
              </div>
              <div className="form-group"><label>Fuel Type</label>
                <select value={form.fuel} onChange={e => update('fuel', e.target.value)}>
                  <option value="">Select</option><option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
                </select>
              </div>
            </div>
            <div className="form-grid-3 mb-16">
              <div className="form-group"><label>Transmission</label>
                <select value={form.transmission} onChange={e => update('transmission', e.target.value)}>
                  <option value="">Select</option><option>Automatic</option><option>Manual</option><option>CVT</option>
                </select>
              </div>
              <div className="form-group"><label>Price (GHS) *</label><input type="number" placeholder="e.g. 150000" value={form.price} onChange={e => update('price', e.target.value)} /></div>
              <div className="form-group"><label>Mileage (km)</label><input type="number" placeholder="e.g. 45000" value={form.mileage} onChange={e => update('mileage', e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Location</label>
              <select value={form.location} onChange={e => update('location', e.target.value)}>
                <option value="">Select Location</option><option>Accra</option><option>Kumasi</option><option>Takoradi</option><option>Tamale</option><option>Cape Coast</option>
              </select>
            </div>
          </div>

            <div className="form-card">
            <h3>Description & Photos</h3>
            <p className="card-sub">Add details and images to attract buyers</p>
            <div className="form-group mb-16">
              <label>Description</label>
              <textarea placeholder="Describe your car's features, condition, and history..." value={form.desc} onChange={e => update('desc', e.target.value)} />
            </div>
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {images.length === 0 ? (
                <>
                  <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                  <h4>Upload Photos</h4>
                  <p>Drag & drop or click to upload (JPEG, PNG). Max 10 images.</p>
                </>
              ) : (
                <div className="upload-previews">
                  {images.map(img => (
                    <div className="thumb" key={img.id}>
                      <img src={img.url} alt={img.name} />
                      <button className="thumb-remove" onClick={(e) => { e.stopPropagation(); handleRemoveImage(img.id); }} aria-label="Remove image">×</button>
                    </div>
                  ))}
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-primary" style={{ flex: 1 }}>Publish Ad</button>
            <button className="btn-secondary">Save Draft</button>
          </div>
        </div>

        <div>
          <div className="sidebar-tip">
            <h4>Tips for a Great Ad</h4>
            <div className="tip-item"><div className="tip-num">1</div><div className="tip-text">Use clear, well-lit photos from multiple angles</div></div>
            <div className="tip-item"><div className="tip-num">2</div><div className="tip-text">Include service history and maintenance records</div></div>
            <div className="tip-item"><div className="tip-num">3</div><div className="tip-text">Be honest about the car's condition</div></div>
            <div className="tip-item"><div className="tip-num">4</div><div className="tip-text">Price competitively — check similar listings</div></div>
            <div className="tip-item"><div className="tip-num">5</div><div className="tip-text">Respond to inquiries promptly</div></div>
          </div>

          <div className="form-card">
            <h4 className="ad-preview-title">Preview</h4>
            <div className="ad-preview">
              <div className="ad-preview-titleline">{form.make || 'Make'} {form.model || 'Model'} {form.year || 'Year'}</div>
              <div className="ad-preview-price">{form.price ? `GHS ${Number(form.price).toLocaleString()}` : 'GHS —'}</div>
              <div className="ad-preview-meta">{[form.condition, form.fuel, form.location].filter(Boolean).join(' · ') || 'No details yet'}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
