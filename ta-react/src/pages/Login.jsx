import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    login({ name: email.split('@')[0], email, role: 'user' });
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">

      <div className="auth-side">
        <div className="side-inner">
          <Link to="/" className="side-logo">
            <div className="lm">TA</div>
            <div className="lt">Trust Automobile<small>Verified Marketplace</small></div>
          </Link>
          <div className="side-hero">
            <h2 className="side-hero-title">Welcome Back</h2>
            <p className="side-hero-sub">
              Sign in to manage your listings, save cars, and connect with verified sellers across Ghana.
            </p>
          </div>
        </div>
        <div className="side-footer">© 2026 Trust Automobile Ghana</div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-sub">Enter your credentials to access your account</p>
          {error && <p style={{ color: 'var(--no-600)', fontSize: 13, marginBottom: 16 }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary">Sign In</button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <p className="auth-bottom">
            Don't have an account? <Link to="/register" className="auth-link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
