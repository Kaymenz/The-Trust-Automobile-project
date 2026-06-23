import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/SkeletonLoader';
import { api } from '../utils/api';

export default function Sell() {
  const [stats, setStats] = useState({ total: 0, sold: 0, pending: 0 });
  const [recentListings, setRecentListings] = useState([]);
  const [makes, setMakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellPageData = async () => {
      try {
        setLoading(true);
        const [statsData, listingsData, makesData] = await Promise.all([
          api.getListingStats(),
          api.getListings({ limit: 3 }),
          api.getCarMakes(),
        ]);
        setStats(statsData || { total: 0, sold: 0, pending: 0 });
        setRecentListings(Array.isArray(listingsData) ? listingsData.slice(0, 3) : []);
        setMakes(Array.isArray(makesData) ? makesData : []);
      } catch (error) {
        console.error('Failed to fetch sell page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellPageData();
  }, []);

  return (
    <Layout activePage="sell">
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Sell Your Car — Free & Verified
          </div>
          <h1>Sell Your Car <em>Fast</em></h1>
          <p className="hero-sub">
            Reach thousands of verified buyers across Ghana. Post your ad for free and sell with confidence.
          </p>
          <div className="sell-hero-actions">
            <Link to="/post-ad" className="btn-primary"><i className="bi bi-plus-circle"></i> Post Free Ad</Link>
            <Link to="/search" className="btn-secondary">Browse Cars</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">How It <span>Works</span></div>
            <div className="section-subtitle">Three simple steps to sell your car</div>
          </div>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg></div>
            <h3>1. Post Your Ad</h3>
            <p>Fill in your car details, upload photos, and publish your listing for free.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon gold"><svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg></div>
            <h3>2. Get Verified</h3>
            <p>Our team verifies your listing to build trust with potential buyers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg></div>
            <h3>3. Close the Deal</h3>
            <p>Connect with serious buyers, negotiate, and complete the sale securely.</p>
          </div>
        </div>
      </section>

      <section className="section benefits-section">
        <div className="section-header">
          <div>
            <div className="section-title">Seller <span>Benefits</span></div>
            <div className="section-subtitle">Why choose Trust Autopilot to sell your vehicle</div>
          </div>
        </div>
        <div className="benefits-grid">
          {[
            { icon: 'bi-eye-fill', title: 'Maximum Visibility', desc: `${stats.total?.toLocaleString() || 0}+ active marketplace listings and growing buyer traffic` },
            { icon: 'bi-shield-check', title: 'Verified Badge', desc: 'Stand out with our trust verification seal' },
            { icon: 'bi-graph-up', title: 'Analytics', desc: `${makes.length || 0} makes currently represented across live inventory` },
            { icon: 'bi-chat-dots', title: 'Direct Messaging', desc: 'Communicate with buyers through our secure platform' },
          ].map(b => (
            <div key={b.title} className="benefit-card">
              <div className="benefit-icon-wrapper">
                <i className={b.icon}></i>
              </div>
              <div className="benefit-info">
                <h3 className="benefit-card-title">{b.title}</h3>
                <p className="benefit-card-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-title">Live <span>Marketplace</span></div>
            <div className="section-subtitle">Recent cars buyers are seeing right now</div>
          </div>
          <Link to="/search" className="view-all">View All Cars →</Link>
        </div>
        <div className="cards-grid">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CarCardSkeleton key={i} />)
            : recentListings.map((car, i) => <CarCard key={car._id} car={car} delay={i * 0.05} />)
          }
        </div>
        {!loading && recentListings.length === 0 && (
          <div className="sell-empty-state">
            <div className="empty-icon-wrap">
              <i className="bi bi-car-front"></i>
            </div>
            <h3>No Live Listings Yet</h3>
            <p>Seed the server data or post the first verified car.</p>
            <Link to="/post-ad" className="btn-primary"><i className="bi bi-plus-circle"></i> Post Your Car</Link>
          </div>
        )}
      </section>

      <section className="section sell-cta-section">
        <div className="sell-cta-container">
          <div className="sell-cta-content">
            <h2>Ready to Sell?</h2>
            <p>Post your ad in minutes — it's completely free, secure, and verified.</p>
            <div className="sell-cta-actions">
              <Link to="/post-ad" className="btn-primary"><i className="bi bi-plus-circle"></i> Post Your Ad Now</Link>
              <Link to="/education" className="btn-secondary-white"><i className="bi bi-info-circle"></i> Seller Guidelines</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
