import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Toggle modal on Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch listings when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setLoading(true);
      api.getListings()
        .then((data) => {
          setListings(data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load search listings:', err);
          setLoading(false);
        });
      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filter listings based on query
  const filteredListings = listings.filter((car) => {
    if (!query) return false;
    const term = query.toLowerCase();
    return (
      car.make?.toLowerCase().includes(term) ||
      car.model?.toLowerCase().includes(term) ||
      car.year?.toString().includes(term) ||
      car.location?.toLowerCase().includes(term) ||
      car.condition?.toLowerCase().includes(term)
    );
  }).slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/search?make=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectListing = (id) => {
    setIsOpen(false);
    navigate(`/listing/${id}`);
  };

  const handleQuickSearch = (type, val) => {
    setIsOpen(false);
    navigate(`/search?${type}=${encodeURIComponent(val)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={() => setIsOpen(false)}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSearchSubmit} className="search-modal-header">
          <i className="bi bi-search search-modal-icon"></i>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search cars, makes, locations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-modal-input"
          />
          <button type="button" className="search-modal-close" onClick={() => setIsOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </form>

        <div className="search-modal-body">
          {query ? (
            <div className="search-modal-results">
              <h4 className="search-modal-section-title">Matching Listings</h4>
              {loading ? (
                <div className="search-modal-loading">Searching database...</div>
              ) : filteredListings.length > 0 ? (
                <div className="search-modal-results-list">
                  {filteredListings.map((car) => (
                    <div
                      key={car._id}
                      onClick={() => handleSelectListing(car._id)}
                      className="search-modal-result-item"
                    >
                      <img
                        src={car.images?.[0] || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300'}
                        alt={`${car.make} ${car.model}`}
                        className="search-modal-result-img"
                      />
                      <div className="search-modal-result-info">
                        <div className="search-modal-result-title">
                          {car.year} {car.make} {car.model}
                        </div>
                        <div className="search-modal-result-meta">
                          <span>{car.condition === 'new' ? 'New' : 'Used'}</span>
                          <span className="dot">•</span>
                          <span>{car.location}</span>
                        </div>
                      </div>
                      <div className="search-modal-result-price">
                        GHS {car.price?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-modal-empty">No cars found matching "{query}"</div>
              )}
            </div>
          ) : (
            <div className="search-modal-defaults">
              <div className="search-modal-section">
                <h4 className="search-modal-section-title">Popular Makes</h4>
                <div className="search-modal-tags">
                  {['Toyota', 'Honda', 'Mercedes-Benz', 'Hyundai', 'BMW', 'Ford'].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleQuickSearch('make', m)}
                      className="search-modal-tag-btn"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="search-modal-section" style={{ marginTop: 24 }}>
                <h4 className="search-modal-section-title">Popular Locations</h4>
                <div className="search-modal-tags">
                  {['Accra', 'Kumasi', 'Takoradi', 'Tamale'].map((l) => (
                    <button
                      key={l}
                      onClick={() => handleQuickSearch('location', l)}
                      className="search-modal-tag-btn"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="search-modal-footer">
          <span className="search-modal-hint"><kbd>ESC</kbd> to close</span>
          <span className="search-modal-hint"><kbd>Enter ↵</kbd> to search</span>
        </div>
      </div>
    </div>
  );
}
