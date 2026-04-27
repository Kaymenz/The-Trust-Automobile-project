import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import CarCard from '../components/CarCard';
import { CARS, MAKES, LOCATIONS } from '../data/cars';

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

  const filtered = useMemo(() => {
    let results = [...CARS];
    if (make) results = results.filter(c => c.make === make);
    if (location) results = results.filter(c => c.location === location);
    if (condition) results = results.filter(c => c.condition === condition);
    if (fuel) results = results.filter(c => c.fuel === fuel);
    if (transmission) results = results.filter(c => c.transmission === transmission);
    if (priceMin) results = results.filter(c => c.price >= Number(priceMin));
    if (priceMax) results = results.filter(c => c.price <= Number(priceMax));
    if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
    else if (sort === 'year-new') results.sort((a, b) => b.year - a.year);
    else results.sort((a, b) => b.id - a.id);
    return results;
  }, [make, location, condition, fuel, transmission, priceMin, priceMax, sort]);

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
            <a href="/">Home</a><span className="breadcrumb-sep">›</span><span>Buy a Car</span>
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
              {MAKES.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <div className="filter-label">Location</div>
            <select value={location} onChange={e => setLocation(e.target.value)}>
              <option value="">All Locations</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
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
            <span className="search-results-count">{filtered.length} cars found</span>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Year: Newest</option>
            </select>
          </div>
          <div className="cards-grid">
            {filtered.map((car, i) => <CarCard key={car.id} car={car} delay={i * 0.05} />)}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8FA3BD' }}>
              <i className="bi bi-search" style={{ fontSize: 40, display: 'block', marginBottom: 16 }}></i>
              <p style={{ fontSize: 16, fontWeight: 600 }}>No cars match your filters</p>
              <p style={{ fontSize: 14 }}>Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
