import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CarCard({ car, delay = 0 }) {
  const { isSaved, toggleSave } = useAuth();
  const navigate = useNavigate();
  // Use _id for MongoDB format, fallback to id for compatibility
  const carId = car._id || car.id;
  const saved = isSaved(carId);

  // Handle API data format differences
  const imageUrl = car.images?.[0] || null;
  const badge = car.condition || (car.isFeatured ? 'Featured' : null);

  return (
    <div className="car-card" style={{ animationDelay: `${delay}s` }} onClick={() => navigate(`/listing/${carId}`)}>
      <div className="car-card-img">
        {imageUrl ? (
          <img src={imageUrl} alt={`${car.make} ${car.model}`} className="car-card-img" />
        ) : (
          <div className="car-card-img-placeholder">
            <svg viewBox="0 0 24 24"><path d="M5 11L6.5 6.5H17.5L19 11M17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16M6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16M18.92 6C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6L3 12V20H5V21H7V20H17V21H19V20H21V12L18.92 6Z"/></svg>
          </div>
        )}
        {badge && <span className={`card-badge ${badge === 'New' ? 'new' : ''}`}>{badge}</span>}
        <button className={`card-save ${saved ? 'saved' : ''}`} onClick={e => { e.stopPropagation(); toggleSave(carId); }}>
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </button>
      </div>
      <div className="car-card-body">
        <div className="card-make">{car.make}</div>
        <div className="card-title">{car.model} {car.year}</div>
        <div className="card-specs">
          <span className="card-spec"><svg viewBox="0 0 24 24"><path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z"/></svg>{(car.mileage || 0).toLocaleString()} km</span>
          <span className="card-spec"><svg viewBox="0 0 24 24"><path d="M19.77 7.23L19.78 7.22L16.06 3.5L15 4.56L17.11 6.67C16.17 7.03 15.5 7.93 15.5 9C15.5 10.38 16.62 11.5 18 11.5C18.36 11.5 18.69 11.42 19 11.29V18.5C19 19.05 18.55 19.5 18 19.5S17 19.05 17 18.5V14C17 12.9 16.1 12 15 12H14V5C14 3.9 13.1 3 12 3H6C4.9 3 4 3.9 4 5V21H14V13.5H15.5V18.5C15.5 19.88 16.62 21 18 21S20.5 19.88 20.5 18.5V9C20.5 8.31 20.22 7.68 19.77 7.23M12 10H6V5H12V10Z"/></svg>{car.fuelType || car.fuel}</span>
          <span className="card-spec"><svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4M9 9V15L15 12L9 9Z"/></svg>{car.transmission}</span>
        </div>
        <div className="card-divider"></div>
        <div className="card-footer">
          <div>
            <div className="card-price-label">Price</div>
            <div className="card-price">GHS {(car.price || 0).toLocaleString()}</div>
          </div>
          <div className="card-location">
            <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/></svg>
            {car.location}
          </div>
        </div>
      </div>
    </div>
  );
}
