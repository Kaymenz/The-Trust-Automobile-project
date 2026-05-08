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
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const roleMap = { parts: 'parts_dealer' };
  const selectedRole = roleMap[role] || role || 'buyer';

  const handleNext = () => {
    if (!role) { setError('Please select a role'); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields'); return;
    }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    
    setError('');
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const result = await register({
      name: fullName,
      email: form.email,
      password: form.password,
      role: selectedRole,
      phone: form.phone || undefined,
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const progress = step === 1 ? 33 : 66;

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="side-inner">
          <Link to="/" className="side-logo">
            <div className="lm">TA</div>
            <div className="lt">Trust Automobile<small>Verified Marketplace</small></div>
          </Link>
          <div className="side-hero">
            <h2 className="side-hero-title">Create Your Account</h2>
            <p className="side-hero-sub">
              Join Ghana&apos;s trusted auto marketplace to buy, sell, rent, or offer automotive services.
            </p>
          </div>
        </div>
        <div className="side-footer">© 2026 Trust Automobile Ghana</div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card register-card">
          <div className="reg-progress"><div className="reg-progress-fill" style={{ width: `${progress}%` }}></div></div>
          <div className="step-label">Step {step} of 2</div>

          {step === 1 && (
            <>
              <h2>Choose Your Path</h2>
              <p className="auth-sub">Select what you want to do on Trust Automobile</p>
              {error && <p className="auth-error">{error}</p>}
              <div className="path-grid">
                {ROLES.map(r => (
                  <button key={r.id} type="button" className={`path-card ${role === r.id ? 'active' : ''}`} onClick={() => setRole(r.id)}>
                    <i className={r.icon}></i>
                    <div className="path-title">{r.label}</div>
                    <div className="path-desc">{r.desc}</div>
                  </button>
                ))}
              </div>
              <button type="button" className="btn-primary mt-16" onClick={handleNext} disabled={loading}>Continue</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Your Details</h2>
              <p className="auth-sub">Fill in your information to create an account</p>
              {error && <p className="auth-error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="form-grid-2">
                  <div className="form-group"><label>First Name *</label><input value={form.firstName} onChange={e => update('firstName', e.target.value)} /></div>
                  <div className="form-group"><label>Last Name *</label><input value={form.lastName} onChange={e => update('lastName', e.target.value)} /></div>
                </div>
                <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => update('email', e.target.value)} /></div>
                <div className="form-group"><label>Phone</label><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
                <div className="form-grid-2">
                  <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={e => update('password', e.target.value)} /></div>
                  <div className="form-group"><label>Confirm Password *</label><input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)} /></div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)} disabled={loading}>Back</button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="auth-divider"><span>or</span></div>
          <p className="auth-bottom">
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
