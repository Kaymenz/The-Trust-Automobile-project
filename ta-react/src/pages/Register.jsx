import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id: 'buyer', label: 'Car Buyer', icon: 'bi-car-front-fill', desc: 'Browse and buy verified cars' },
  { id: 'seller', label: 'Car Seller', icon: 'bi-tag-fill', desc: 'List and sell your vehicles' },
  { id: 'renter', label: 'Car Renter', icon: 'bi-key-fill', desc: 'Rent vehicles for your needs' },
  { id: 'mechanic', label: 'Mechanic', icon: 'bi-tools', desc: 'Offer repair services' },
  { id: 'parts', label: 'Parts Dealer', icon: 'bi-box-seam-fill', desc: 'Sell spare parts & accessories' },
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleNext = () => {
    if (!role) { setError('Please select a role'); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields'); return;
    }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    login({ name: `${form.firstName} ${form.lastName}`, email: form.email, role, firstName: form.firstName, lastName: form.lastName, phone: form.phone });
    navigate('/dashboard');
  };

  const progress = step === 1 ? 33 : 66;

  return (
    <>
      <div style={{ background: '#0B1E3D', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: 'var(--gold-500)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy-900)' }}>TA</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', letterSpacing: '0.06em', lineHeight: 1.1 }}>Trust Automobile<small style={{ display: 'block', fontSize: '0.6rem', fontWeight: 400, color: 'var(--slate-500)', letterSpacing: '0.14em' }}>Verified Marketplace</small></div>
        </Link>
        <Link to="/login" style={{ fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.08em', color: 'var(--slate-500)', textDecoration: 'none' }}>Already have an account? Sign In</Link>
      </div>

      <div className="reg-page">
        <div className="reg-card">
          <div className="reg-progress"><div className="reg-progress-fill" style={{ width: `${progress}%` }}></div></div>

          {step === 1 && (
            <div style={{ padding: '20px 32px 32px' }}>
              <div className="reg-card-head">
                <div className="step-label">Step 1 of 2</div>
                <h2>Choose Your Path</h2>
                <p>What would you like to do on Trust Automobile?</p>
              </div>
              <div style={{ height: 1, background: '#EEF2F8', margin: '20px 0' }}></div>
              {error && <p style={{ color: 'var(--no-600)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <div className="path-grid">
                {ROLES.map(r => (
                  <div key={r.id} className={`path-card ${role === r.id ? 'active' : ''}`} onClick={() => setRole(r.id)}>
                    <i className={r.icon} style={{ fontSize: 24, color: role === r.id ? 'var(--gold-500)' : 'var(--navy-600)', marginBottom: 8 }}></i>
                    <div style={{ fontWeight: 600, color: 'var(--navy-900)', fontSize: 14 }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-500)', marginTop: 4 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ width: '100%', marginTop: 24 }} onClick={handleNext}>Continue</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ padding: '20px 32px 32px' }}>
              <div className="reg-card-head">
                <div className="step-label">Step 2 of 2</div>
                <h2>Your Details</h2>
                <p>Fill in your information to create an account</p>
              </div>
              <div style={{ height: 1, background: '#EEF2F8', margin: '20px 0' }}></div>
              {error && <p style={{ color: 'var(--no-600)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="form-group"><label>First Name *</label><input value={form.firstName} onChange={e => update('firstName', e.target.value)} /></div>
                  <div className="form-group"><label>Last Name *</label><input value={form.lastName} onChange={e => update('lastName', e.target.value)} /></div>
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}><label>Email *</label><input type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                <div className="form-group" style={{ marginBottom: 16 }}><label>Phone</label><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
                <div className="form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={e => update('password', e.target.value)} /></div>
                  <div className="form-group"><label>Confirm Password *</label><input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} /></div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Account</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
