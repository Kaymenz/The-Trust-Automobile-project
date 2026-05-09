import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import CarCard from '../components/CarCard';
import { CarCardSkeleton } from '../components/SkeletonLoader';
import { api } from '../utils/api';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [make, setMake] = useState(searchParams.get('make') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState('newest');
  
  // API data states
  const [listings, setListings] = useState([]);
  const [makes, setMakes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const filters = {};
        if (make) filters.make = make;
        if (location) filters.location = location;
        if (condition) filters.condition = condition;
        if (fuel) filters.fuelType = fuel;
        if (transmission) filters.transmission = transmission;
        if (priceMin) filters.minPrice = priceMin;
        if (priceMax) filters.maxPrice = priceMax;
        
        const data = await api.getListings(filters);
        setListings(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        setError('Failed to load listings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [make, location, condition, fuel, transmission, priceMin, priceMax]);

  // Fetch makes from API
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const data = await api.getCarMakes();
        setMakes(data);
      } catch (err) {
        console.error('Failed to fetch makes:', err);
      }
    };
    fetchMakes();
  }, []);

  // Extract unique locations from listings
  useEffect(() => {
    const uniqueLocations = [...new Set(listings.map(l => l.location).filter(Boolean))];
    setLocations(uniqueLocations);
  }, [listings]);

  const filtered = useMemo(() => {
    let results = [...listings];
    // Server already filters, but we sort here
    if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
    else if (sort === 'year-new') results.sort((a, b) => b.year - a.year);
    else results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return results;
  }, [listings, sort]);

  const clearFilters = () => {
    setMake(''); setLocation(''); setCondition(''); setFuel('');
    setTransmission(''); setPriceMin(''); setPriceMax('');
    setSearchParams({});
  };

  return (
    <Layout activePage="search">
      <div className="page-header">
        <div className="page-header-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="breadcrumb-sep">›</span><span>Buy a Car</span>
          </div>
          <h1>Search Cars</h1>
          <p>Browse verified listings from trusted sellers across Ghana</p>
        </div>
      </div>

      <div className="search-layout">
        <div className="filters-panel">
          <div className="filters-title">
            Filters
            <button className="clear-btn" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filter-group">
            <div className="filter-label">Make</div>
            <select value={make} onChange={e => setMake(e.target.value)}>
              <option value="">All Makes</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-label">Location</div>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-label">Condition</div>
            <select value={condition} onChange={e => setCondition(e.target.value)}>
              <option value="">Any</option>
              <option>New</option>
              <option>Used</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-label">Fuel Type</div>
            <select value={fuel} onChange={e => setFuel(e.target.value)}>
              <option value="">Any</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-label">Transmission</div>
            <select value={transmission} onChange={e => setTransmission(e.target.value)}>
              <option value="">Any</option>
              <option>Automatic</option>
              <option>Manual</option>
              <option>CVT</option>
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-label">Price Range (GHS)</div>
            <div className="price-range">
              <input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
              <input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <div className="search-results-header">
            <span className="search-results-count">
              {loading ? 'Loading...' : `${filtered.length} cars found`}
            </span>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest</option>
            </select>
          </div>
          
          {loading && (
            <div className="cards-grid">
              {Array.from({ length: 8 }).map((_, i) => <CarCardSkeleton key={i} />)}
            </div>
          )}
          
          {error && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#dc3545' }}>
              <i className="bi bi-exclamation-circle" style={{ fontSize: 40, display: 'block', marginBottom: 16 }}></i>
              <p style={{ fontSize: 16, fontWeight: 600 }}>{error}</p>
              <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              <div className="cards-grid">
                {filtered.map((car, i) => <CarCard key={car._id} car={car} delay={i * 0.05} />)}
              </div>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8FA3BD' }}>
                  <i className="bi bi-search" style={{ fontSize: 40, display: 'block', marginBottom: 16 }}></i>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>No cars match your filters</p>
                  <p style={{ fontSize: 14 }}>Try adjusting your search criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
