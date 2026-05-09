import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/SkeletonLoader';
import { api } from '../utils/api';
import { useEffect, useRef, useState } from 'react';

const MAKE_ICONS = {
  Toyota: '🚗', Honda: '🏎️', 'Mercedes-Benz': '⭐', Hyundai: '🚙',
  BMW: '🏁', Ford: '🛻', Kia: '🚘', Nissan: '🚕', Volkswagen: '🚜',
};

export default function Home() {
  const cardRef = useRef(null);
  
  // API data states
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [makes, setMakes] = useState([]);
  const [makeCounts, setMakeCounts] = useState({});
  const [listingStats, setListingStats] = useState({ total: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.car-card, .make-card, .feature-card, .fade-in').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured listings
        const featuredData = await api.getFeaturedListings();
        setFeatured(featuredData.slice(0, 4));
        
        // Fetch recent listings
        const allListings = await api.getListings({});
        setRecent(allListings.slice(0, 8));
        
        // Fetch makes
        const makesData = await api.getCarMakes();
        setMakes(makesData);
        
        // Count listings per make
        const counts = {};
        allListings.forEach(car => {
          counts[car.make] = (counts[car.make] || 0) + 1;
        });
        setMakeCounts(counts);
        
        // Fetch listing stats
        const stats = await api.getListingStats();
        setListingStats(stats);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout activePage="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-content">
          <div className="hero-badge">
            Ghana's #1 Verified Car Marketplace
          </div>
          <h1>Buy &amp; Sell Cars <em>With Trust</em></h1>
          <p className="hero-sub">
            Every listing verified. Every seller vetted. Browse thousands of cars from trusted dealers and private sellers across Ghana.
          </p>
          <div className="search-box">
            <div className="search-row">
              <div className="form-group">
                <label>Make</label>
                <select><option value="">All Makes</option>{makes.map(m => <option key={m} value={m}>{m}</option>)}</select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <select><option value="">All Locations</option><option>Accra</option><option>Kumasi</option><option>Takoradi</option><option>Tamale</option><option>Cape Coast</option></select>
              </div>
              <div className="form-group">
                <label>Price Range</label>
                <select><option value="">Any Price</option><option>Under 100,000</option><option>100,000 - 200,000</option><option>200,000 - 350,000</option><option>350,000+</option></select>
              </div>
              <Link to="/search" className="btn-primary">
                <i className="bi bi-search"></i> Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-pill">
        <div className="stat-item"><div className="stat-num">{listingStats.total?.toLocaleString() || '0'}+</div><div className="stat-label">Cars Listed</div></div>
        <div className="stat-divider"></div>
        <div className="stat-item"><div className="stat-num">{Math.floor(listingStats.total / 10) || '0'}+</div><div className="stat-label">Verified Dealers</div></div>
        <div className="stat-divider"></div>
        <div className="stat-item"><div className="stat-num">16</div><div className="stat-label">Regions Covered</div></div>
        <div className="stat-divider"></div>
        <div className="stat-item"><div className="stat-num">98%</div><div className="stat-label">Satisfaction Rate</div></div>
      </div>

      {/* Featured Cars */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">Featured <span>Cars</span></div>
            <div className="section-subtitle">Hand-picked by our team — top quality, best value</div>
          </div>
          <Link to="/search" className="view-all">View All Cars →</Link>
        </div>
        <div className="cards-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <CarCardSkeleton key={i} />)
            : featured.map((car, i) => <CarCard key={car._id} car={car} delay={i * 0.1} />)
          }
        </div>
      </section>

      {/* Browse by Make */}
      <section className="section bg-white">
        <div className="section-header">
          <div>
            <div className="section-title">Browse by <span>Make</span></div>
            <div className="section-subtitle">Find your preferred brand</div>
          </div>
        </div>
        <div className="make-grid">
          {makes.slice(0, 8).map(make => (
            <Link to={`/search?make=${make}`} key={make} className="make-card">
              <div className="make-card-icon">
                  <span>{MAKE_ICONS[make] || '🚗'}</span>
                </div>
              <div className="make-card-name">{make}</div>
              <div className="make-card-count">{makeCounts[make] || 0} cars</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">Recent <span>Listings</span></div>
            <div className="section-subtitle">Latest cars added to the marketplace</div>
          </div>
          <Link to="/search" className="view-all">View All →</Link>
        </div>
        <div className="cards-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CarCardSkeleton key={i} />)
            : recent.map((car, i) => <CarCard key={car._id} car={car} delay={i * 0.05} />)
          }
        </div>
      </section>

      {/* Why Trust Automobile */}
      <section className="section bg-white">
        <div className="section-header">
          <div>
            <div className="section-title">Why <span>Trust Automobile</span></div>
            <div className="section-subtitle">The safest way to buy and sell cars in Ghana</div>
          </div>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg></div>
            <h3>Verified Listings</h3>
            <p>Every car is inspected and verified before it goes live. No scams, no fake ads.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon gold"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
            <h3>Trusted Sellers</h3>
            <p>All dealers and private sellers go through our vetting process. Buy with confidence.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg></div>
            <h3>Secure Payments</h3>
            <p>Our escrow system protects both buyers and sellers during transactions.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-dark">
        <h2 className="cta-title">Ready to Sell Your Car?</h2>
        <p className="cta-text">Post your ad for free and reach thousands of verified buyers across Ghana.</p>
        <div className="flex-center">
          <Link to="/post-ad" className="btn-primary">Post an Ad — Free</Link>
          <Link to="/search" className="btn-secondary btn-muted">Browse Cars</Link>
        </div>
      </section>
    </Layout>
  );
}
