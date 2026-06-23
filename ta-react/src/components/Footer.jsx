import { Link } from 'react-router-dom';
import goldenLamboLogo from '../assets/golden_lambo_logo.png';

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <img
                src={goldenLamboLogo}
                alt="Trust Autopilot Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            <div className="nav-logo-text-wrap">
              <span className="nav-logo-name">Trust Autopilot</span>
              <span className="nav-logo-sub">Verified Marketplace</span>
            </div>
          </Link>
          <p>Ghana's most trusted online car marketplace. Buy and sell with confidence.</p>
        </div>
        <div className="footer-col"><h4>Explore</h4><ul>
          <li><Link to="/search">All Cars</Link></li>
          <li><Link to="/search?condition=New">New Cars</Link></li>
          <li><Link to="/search?condition=Used">Used Cars</Link></li>
          <li><Link to="/spareparts">Spare Parts</Link></li>
          <li><Link to="/mechanic">Mechanics</Link></li>
        </ul></div>
        <div className="footer-col"><h4>Account</h4><ul>
          <li><Link to="/login">Sign In</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/post-ad">Post an Ad</Link></li>
          <li><Link to="/dashboard">My Dashboard</Link></li>
        </ul></div>
        <div className="footer-col"><h4>Company</h4><ul>
          <li><a href="#">About Trust Autopilot</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
        </ul></div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">© 2026 <span>Trust Autopilot Ghana</span>. All rights reserved.</p>
        <p className="footer-copy">Built with ♥ for Ghana</p>
      </div>
    </footer>
  );
}


