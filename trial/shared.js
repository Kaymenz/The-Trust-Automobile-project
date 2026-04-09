// ── TRUST AUTOMOBILE — Shared JS ──
// Simulated session/auth state
const TA = {
  // Fake logged-in user — swap to PHP session in production
  user: JSON.parse(localStorage.getItem('ta_user') || 'null'),

  login(userData) {
    localStorage.setItem('ta_user', JSON.stringify(userData));
    this.user = userData;
  },

  logout() {
    localStorage.removeItem('ta_user');
    this.user = null;
    window.location.href = 'index.html';
  },

  isLoggedIn() {
    return !!this.user;
  },

  // Saved cars
  getSaved() {
    return JSON.parse(localStorage.getItem('ta_saved') || '[]');
  },

  toggleSave(id) {
    let saved = this.getSaved();
    if (saved.includes(id)) {
      saved = saved.filter(s => s !== id);
    } else {
      saved.push(id);
    }
    localStorage.setItem('ta_saved', JSON.stringify(saved));
    return saved.includes(id);
  },

  isSaved(id) {
    return this.getSaved().includes(id);
  }
};

// ── Sample car data (replace with PHP/MySQL fetch) ──
const CARS = [
  { id:1, make:'Toyota', model:'Land Cruiser Prado', year:2020, price:320000, mileage:42000, fuel:'Petrol', transmission:'Automatic', location:'Accra', condition:'Used', badge:'Featured', desc:'Excellent condition. Full service history. Leather seats, sunroof, reverse camera. No accidents.' },
  { id:2, make:'Honda', model:'CR-V EX', year:2023, price:148000, mileage:8200, fuel:'Petrol', transmission:'Automatic', location:'Kumasi', condition:'New', badge:'New', desc:'Brand new import. Factory warranty. Apple CarPlay, Android Auto. Available for test drive.' },
  { id:3, make:'Mercedes-Benz', model:'C200 AMG', year:2021, price:320000, mileage:31000, fuel:'Petrol', transmission:'Automatic', location:'Accra', condition:'Used', badge:'Featured', desc:'AMG Sport package. Panoramic roof. Heated seats. Full spec. Serious buyers only.' },
  { id:4, make:'Hyundai', model:'Tucson GLS', year:2019, price:88000, mileage:72000, fuel:'Diesel', transmission:'Manual', location:'Takoradi', condition:'Used', badge:'', desc:'Family SUV in great shape. New tyres. Cold AC. Clean interior. No hidden faults.' },
  { id:5, make:'Toyota', model:'Corolla LE', year:2020, price:65000, mileage:45000, fuel:'Petrol', transmission:'Automatic', location:'Accra', condition:'Used', badge:'Featured', desc:'Single owner. Clean title. Just serviced. Fuel efficient city car. Available for viewing.' },
  { id:6, make:'BMW', model:'X5 xDrive', year:2022, price:420000, mileage:15000, fuel:'Petrol', transmission:'Automatic', location:'Accra', condition:'Used', badge:'', desc:'Full options. HUD display. Harman Kardon audio. 360 camera. Serious enquiries only.' },
  { id:7, make:'Ford', model:'Ranger Wildtrak', year:2021, price:175000, mileage:38000, fuel:'Diesel', transmission:'Automatic', location:'Kumasi', condition:'Used', badge:'', desc:'4x4. Bi-turbo diesel. Hard tonneau cover. Spotless interior. Workhorse and weekend warrior.' },
  { id:8, make:'Kia', model:'Sportage GT', year:2022, price:110000, mileage:22000, fuel:'Petrol', transmission:'Automatic', location:'Accra', condition:'Used', badge:'', desc:'GT-Line spec. Full panoramic roof. Heated and cooled seats. Low mileage, immaculate condition.' },
  { id:9, make:'Nissan', model:'X-Trail', year:2018, price:72000, mileage:91000, fuel:'Petrol', transmission:'CVT', location:'Cape Coast', condition:'Used', badge:'', desc:'7-seater. Family owned. All services done at dealership. New brake pads and battery.' },
  { id:10, make:'Volkswagen', model:'Tiguan TSI', year:2021, price:195000, mileage:28000, fuel:'Petrol', transmission:'Automatic', location:'Accra', condition:'Used', badge:'', desc:'Imported from Germany. One owner. DSG gearbox. Full VW service history. Beautiful condition.' },
  { id:11, make:'Toyota', model:'Hilux GD6', year:2022, price:220000, mileage:19000, fuel:'Diesel', transmission:'Manual', location:'Tamale', condition:'Used', badge:'', desc:'Double cab. Canopy included. Lightly used fleet vehicle. Excellent working condition.' },
  { id:12, make:'Honda', model:'Accord Sport', year:2020, price:95000, mileage:55000, fuel:'Petrol', transmission:'Automatic', location:'Accra', condition:'Used', badge:'', desc:'Sport trim. Honda Sensing safety suite. Wireless CarPlay. Clean and well maintained.' },
];

// Render a car card
function renderCard(car, delay = 0) {
  const saved = TA.isSaved(car.id);
  return `
  <div class="car-card" style="animation-delay:${delay}s" onclick="window.location.href='listing.html?id=${car.id}'">
    <div class="car-card-img">
      <div class="car-card-img-placeholder">
        <svg viewBox="0 0 24 24"><path d="M5 11L6.5 6.5H17.5L19 11M17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16M6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16M18.92 6C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6L3 12V20H5V21H7V20H17V21H19V20H21V12L18.92 6Z"/></svg>
      </div>
      ${car.badge ? `<span class="card-badge ${car.badge === 'New' ? 'new' : ''}">${car.badge}</span>` : ''}
      <button class="card-save ${saved ? 'saved' : ''}" onclick="event.stopPropagation(); handleSave(this, ${car.id})">
        <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
      </button>
    </div>
    <div class="car-card-body">
      <div class="card-make">${car.make}</div>
      <div class="card-title">${car.model} ${car.year}</div>
      <div class="card-specs">
        <span class="card-spec"><svg viewBox="0 0 24 24"><path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12.5 7V12.25L17 14.92L16.25 16.15L11 13V7H12.5Z"/></svg>${car.mileage.toLocaleString()} km</span>
        <span class="card-spec"><svg viewBox="0 0 24 24"><path d="M19.77 7.23L19.78 7.22L16.06 3.5L15 4.56L17.11 6.67C16.17 7.03 15.5 7.93 15.5 9C15.5 10.38 16.62 11.5 18 11.5C18.36 11.5 18.69 11.42 19 11.29V18.5C19 19.05 18.55 19.5 18 19.5S17 19.05 17 18.5V14C17 12.9 16.1 12 15 12H14V5C14 3.9 13.1 3 12 3H6C4.9 3 4 3.9 4 5V21H14V13.5H15.5V18.5C15.5 19.88 16.62 21 18 21S20.5 19.88 20.5 18.5V9C20.5 8.31 20.22 7.68 19.77 7.23M12 10H6V5H12V10Z"/></svg>${car.fuel}</span>
        <span class="card-spec"><svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4M9 9V15L15 12L9 9Z"/></svg>${car.transmission}</span>
      </div>
      <div class="card-divider"></div>
      <div class="card-footer">
        <div>
          <div class="card-price-label">Price</div>
          <div class="card-price">GHS ${car.price.toLocaleString()}</div>
        </div>
        <div class="card-location">
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z"/></svg>
          ${car.location}
        </div>
      </div>
    </div>
  </div>`;
}

function handleSave(btn, id) {
  const isSaved = TA.toggleSave(id);
  btn.classList.toggle('saved', isSaved);
}

// Navbar renderer
function renderNav(activePage) {
  const user = TA.user;
  return `
  <nav>
    <a href="index.html" class="nav-logo">
      <div class="nav-logo-icon"><span>TA</span></div>
      <div class="nav-logo-text-wrap">
        <span class="nav-logo-name">Trust Automobile</span>
        <span class="nav-logo-sub">Verified Marketplace</span>
      </div>
    </a>
    <ul class="nav-links">
      <li><a href="index.html" ${activePage==='home'?'class="active"':''}>Home</a></li>
      <li><a href="search.html" ${activePage==='search'?'class="active"':''}>Buy a Car</a></li>
      <li><a href="post-ad.html" ${activePage==='post'?'class="active"':''}>Sell a Car</a></li>
      <li><a href="search.html?type=dealer" ${activePage==='dealers'?'class="active"':''}>Dealers</a></li>
    </ul>
    <div class="nav-actions">
      ${user ? `
        <a href="dashboard.html" class="btn-login">${user.name.split(' ')[0]}</a>
        ${user.role === 'admin' ? `<a href="admin.html" class="btn-login" style="color:#E8A020;border-color:#E8A020">Admin</a>` : ''}
        <button class="btn-login" onclick="TA.logout()">Sign Out</button>
        <a href="post-ad.html" class="btn-post">+ Post an Ad</a>
      ` : `
        <a href="login.html" class="btn-login">Sign In</a>
        <a href="post-ad.html" class="btn-post">+ Post an Ad</a>
      `}
    </div>
  </nav>`;
}

// Footer renderer
function renderFooter() {
  return `
  <footer>
    <div class="footer-top">
      <div class="footer-brand">
        <a href="index.html" class="nav-logo">
          <div class="nav-logo-icon"><span>TA</span></div>
          <div class="nav-logo-text-wrap">
            <span class="nav-logo-name">Trust Automobile</span>
            <span class="nav-logo-sub">Verified Marketplace</span>
          </div>
        </a>
        <p>Ghana's most trusted online car marketplace. Buy and sell with confidence.</p>
      </div>
      <div class="footer-col"><h4>Explore</h4><ul>
        <li><a href="search.html">All Cars</a></li>
        <li><a href="search.html?condition=New">New Cars</a></li>
        <li><a href="search.html?condition=Used">Used Cars</a></li>
        <li><a href="search.html">By Make</a></li>
      </ul></div>
      <div class="footer-col"><h4>Account</h4><ul>
        <li><a href="login.html">Sign In</a></li>
        <li><a href="login.html#register">Register</a></li>
        <li><a href="post-ad.html">Post an Ad</a></li>
        <li><a href="dashboard.html">My Dashboard</a></li>
      </ul></div>
      <div class="footer-col"><h4>Company</h4><ul>
        <li><a href="#">About TA</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Use</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">© 2026 <span>Trust Automobile Ghana</span>. All rights reserved.</p>
      <p class="footer-copy">Built with ♥ for Ghana</p>
    </div>
  </footer>`;
}

// Scroll animation
function initScrollAnim() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.car-card, .make-card, .feature-card, .fade-in').forEach(el => obs.observe(el));
}
