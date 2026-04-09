/* ============================================================
   rent.js — Trust Automobile Rentals
   ============================================================ */

   'use strict';

   /* ── FLEET DATA ── */
   const FLEET = [
     {
       id: 1, type: 'economy',
       name: 'Toyota Yaris', subtitle: 'Economy · Hatchback',
       price: 180, currency: 'GHS',
       seats: 5, fuel: 'Petrol', transmission: 'Auto',
       badge: 'available',
       img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=70',
       location: 'Accra'
     },
     {
       id: 2, type: 'suv',
       name: 'Toyota RAV4', subtitle: 'SUV · 4WD',
       price: 450, currency: 'GHS',
       seats: 5, fuel: 'Petrol', transmission: 'Auto',
       badge: 'available',
       img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=70',
       location: 'Accra'
     },
     {
       id: 3, type: 'luxury',
       name: 'Mercedes E-Class', subtitle: 'Luxury · Sedan',
       price: 850, currency: 'GHS',
       seats: 5, fuel: 'Petrol', transmission: 'Auto',
       badge: 'premium',
       img: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&q=70',
       location: 'Accra'
     },
     {
       id: 4, type: 'electric',
       name: 'Tesla Model 3', subtitle: 'Electric · Sedan',
       price: 620, currency: 'GHS',
       seats: 5, fuel: 'Electric', transmission: 'Auto',
       badge: 'electric',
       img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=70',
       location: 'Accra'
     },
     {
       id: 5, type: 'suv',
       name: 'Ford Explorer', subtitle: 'SUV · 7-Seater',
       price: 520, currency: 'GHS',
       seats: 7, fuel: 'Petrol', transmission: 'Auto',
       badge: 'available',
       img: 'https://images.unsplash.com/photo-1568844293986-ca9c5c525285?w=600&q=70',
       location: 'Kumasi'
     },
     {
       id: 6, type: 'compact',
       name: 'Honda Civic', subtitle: 'Compact · Sedan',
       price: 220, currency: 'GHS',
       seats: 5, fuel: 'Petrol', transmission: 'Manual',
       badge: 'available',
       img: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&q=70',
       location: 'Takoradi'
     },
     {
       id: 7, type: 'minivan',
       name: 'Toyota Hiace', subtitle: 'Minivan · 15-Seater',
       price: 380, currency: 'GHS',
       seats: 15, fuel: 'Diesel', transmission: 'Manual',
       badge: 'available',
       img: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=70',
       location: 'Accra'
     },
     {
       id: 8, type: 'luxury',
       name: 'BMW 5 Series', subtitle: 'Luxury · Sedan',
       price: 780, currency: 'GHS',
       seats: 5, fuel: 'Petrol', transmission: 'Auto',
       badge: 'premium',
       img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=70',
       location: 'Accra'
     },
     {
       id: 9, type: 'electric',
       name: 'Nissan Leaf', subtitle: 'Electric · Hatchback',
       price: 390, currency: 'GHS',
       seats: 5, fuel: 'Electric', transmission: 'Auto',
       badge: 'electric',
       img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=70',
       location: 'Kumasi'
     }
   ];
   
   /* ── STATE ── */
   let visibleCount = 6;
   let activeFilter = 'all';
   let currentCar   = null;
   let modalStep    = 1;
   let selectedIns  = 'basic';
   let rentalDays   = 1;
   let bookingRef   = '';
   
   const INS = {
     none:  { label: 'No Insurance',   desc: 'You cover all damages',           price: 0 },
     basic: { label: 'Basic Cover',    desc: 'Third-party only',                 price: 50 },
     full:  { label: 'Comprehensive',  desc: 'Full cover inc. own damage',       price: 120 }
   };
   
   /* ── DOM READY ── */
   document.addEventListener('DOMContentLoaded', () => {
     initParticles();
     initNavScroll();
     initHamburger();
     initCounters();
     initReveal();
     initSearch();
     initFilterChips();
     initCategoryChips();
     initModal();
     initBackToTop();
     renderFleet();
     setMinDates();
   });
   
   /* ── PARTICLES ── */
   function initParticles() {
     const container = document.getElementById('particles');
     if (!container) return;
     for (let i = 0; i < 18; i++) {
       const p = document.createElement('div');
       p.className = 'particle';
       const size = Math.random() * 6 + 3;
       p.style.cssText = `
         width:${size}px; height:${size}px;
         left:${Math.random() * 100}%;
         bottom:${Math.random() * 30}%;
         animation-delay:${Math.random() * 8}s;
         animation-duration:${Math.random() * 6 + 6}s;
       `;
       container.appendChild(p);
     }
   }
   
   /* ── NAV SCROLL ── */
   function initNavScroll() {
     const nav = document.getElementById('navbar');
     window.addEventListener('scroll', () => {
       nav.classList.toggle('scrolled', window.scrollY > 60);
     }, { passive: true });
   }
   
   /* ── HAMBURGER ── */
   function initHamburger() {
     document.getElementById('hamburgerBtn').addEventListener('click', () => {
       document.getElementById('mobileMenu').classList.add('open');
       document.body.style.overflow = 'hidden';
     });
     document.getElementById('closeMenu').addEventListener('click', closeMobileMenu);
   }
   function closeMobileMenu() {
     document.getElementById('mobileMenu').classList.remove('open');
     document.body.style.overflow = '';
   }
   window.closeMobileMenu = closeMobileMenu;
   
   /* ── COUNTERS ── */
   function initCounters() {
     const nums = document.querySelectorAll('.hero-stat-num[data-count]');
     const obs = new IntersectionObserver(entries => {
       entries.forEach(e => {
         if (!e.isIntersecting) return;
         const target = +e.target.dataset.count;
         let current = 0;
         const step = target / 50;
         const t = setInterval(() => {
           current = Math.min(current + step, target);
           e.target.textContent = Math.round(current) + (target === 24 ? '/7' : '+');
           if (current >= target) clearInterval(t);
         }, 30);
         obs.unobserve(e.target);
       });
     }, { threshold: 0.5 });
     nums.forEach(n => obs.observe(n));
   }
   
   /* ── REVEAL ── */
   function initReveal() {
     const obs = new IntersectionObserver(entries => {
       entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
     }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
     document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
   }
   
   /* ── BACK TO TOP ── */
   function initBackToTop() {
     const btn = document.getElementById('backToTop');
     window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
     btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
   }
   
   /* ── SET MIN DATES ── */
   function setMinDates() {
     const today = new Date().toISOString().split('T')[0];
     const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
     const pDate = document.getElementById('pickupDate');
     const rDate = document.getElementById('returnDate');
     if (pDate) { pDate.min = today; pDate.value = today; }
     if (rDate) { rDate.min = tomorrow; rDate.value = tomorrow; }
   }
   
   /* ── SEARCH ── */
   function initSearch() {
     document.getElementById('searchBtn').addEventListener('click', () => {
       const loc  = document.getElementById('pickupLocation').value;
       const type = document.getElementById('carTypeFilter').value;
       activeFilter = type || 'all';
       syncChips();
       renderFleet(loc);
       showToast('Showing available vehicles', 'info');
       document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
     });
   }
   
   function syncChips() {
     document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === activeFilter));
     document.querySelectorAll('.cat-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === activeFilter));
   }
   
   /* ── FILTER CHIPS ── */
   function initFilterChips() {
     document.querySelectorAll('.filter-chip').forEach(chip => {
       chip.addEventListener('click', () => {
         activeFilter = chip.dataset.filter;
         syncChips();
         renderFleet();
       });
     });
   }
   
   /* ── CATEGORY CHIPS (mobile) ── */
   function initCategoryChips() {
     document.querySelectorAll('.cat-chip').forEach(chip => {
       chip.addEventListener('click', () => {
         activeFilter = chip.dataset.filter;
         syncChips();
         renderFleet();
       });
     });
   }
   
   /* ── RENDER FLEET ── */
   function renderFleet(locationFilter) {
     const grid    = document.getElementById('fleetGrid');
     const noRes   = document.getElementById('noResults');
     const moreBtn = document.getElementById('loadMoreWrap');
     visibleCount  = 6;
   
     let cars = activeFilter === 'all' ? FLEET : FLEET.filter(c => c.type === activeFilter);
     if (locationFilter) cars = cars.filter(c => c.location === locationFilter);
   
     noRes.style.display   = cars.length === 0 ? 'block' : 'none';
     moreBtn.style.display = cars.length > visibleCount ? 'block' : 'none';
     grid.innerHTML        = cars.slice(0, visibleCount).map(carCard).join('');
     attachCardEvents();
     initRevealCards();
   
     document.getElementById('loadMoreBtn').onclick = () => {
       visibleCount += 3;
       grid.innerHTML = cars.slice(0, visibleCount).map(carCard).join('');
       moreBtn.style.display = cars.length > visibleCount ? 'block' : 'none';
       attachCardEvents();
       initRevealCards();
     };
   }
   
   function initRevealCards() {
     const obs = new IntersectionObserver(entries => {
       entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
     }, { threshold: 0.08 });
     document.querySelectorAll('.car-card.reveal:not(.visible)').forEach(el => obs.observe(el));
   }
   
   function carCard(car) {
     const imgTag = car.img
       ? `<img src="${car.img}" alt="${car.name}" loading="lazy" />`
       : `<div class="car-img-placeholder"><i class="bi bi-car-front-fill"></i></div>`;
   
     return `
     <div class="car-card reveal" data-id="${car.id}">
       <div class="car-img">
         ${imgTag}
         <span class="car-badge ${car.badge}">${car.badge.charAt(0).toUpperCase() + car.badge.slice(1)}</span>
       </div>
       <div class="car-body">
         <div class="car-title">${car.name}</div>
         <div class="car-subtitle">${car.subtitle}</div>
         <div class="car-specs">
           <span class="car-spec"><i class="bi bi-person-fill"></i> ${car.seats} seats</span>
           <span class="car-spec"><i class="bi bi-fuel-pump-fill"></i> ${car.fuel}</span>
           <span class="car-spec"><i class="bi bi-gear-fill"></i> ${car.transmission}</span>
           <span class="car-spec"><i class="bi bi-geo-alt-fill"></i> ${car.location}</span>
         </div>
         <div class="car-footer">
           <div class="car-price">${car.currency} ${car.price.toLocaleString()} <small>/day</small></div>
           <div class="car-actions">
             <button class="btn-book" data-id="${car.id}">Book Now</button>
             <button class="btn-details" data-id="${car.id}">Details</button>
           </div>
         </div>
       </div>
     </div>`;
   }
   
   function attachCardEvents() {
     document.querySelectorAll('.btn-book[data-id]').forEach(btn => {
       btn.addEventListener('click', () => openModal(+btn.dataset.id));
     });
     document.querySelectorAll('.btn-details[data-id]').forEach(btn => {
       btn.addEventListener('click', () => {
         const car = FLEET.find(c => c.id === +btn.dataset.id);
         showToast(`${car.name} — ${car.seats} seats, ${car.fuel}, ${car.transmission}`, 'info');
       });
     });
   }
   
   /* ── SCROLL TO FLEET ── */
   window.scrollToFleet = function () {
     document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
   };
   
   /* ── MODAL ── */
   function initModal() {
     document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
     document.getElementById('bookingBackdrop').addEventListener('click', e => {
       if (e.target === e.currentTarget) closeModal();
     });
   }
   
   function openModal(carId) {
     currentCar = FLEET.find(c => c.id === carId);
     if (!currentCar) return;
     modalStep   = 1;
     selectedIns = 'basic';
     calcDays();
     bookingRef  = '';
     document.getElementById('bookingBackdrop').classList.add('open');
     document.body.style.overflow = 'hidden';
     renderModal();
   }
   
   function closeModal() {
     document.getElementById('bookingBackdrop').classList.remove('open');
     document.body.style.overflow = '';
   }
   
   function calcDays() {
     const p = document.getElementById('pickupDate')?.value;
     const r = document.getElementById('returnDate')?.value;
     if (p && r) {
       const diff = (new Date(r) - new Date(p)) / 86400000;
       rentalDays = diff > 0 ? diff : 1;
     } else {
       rentalDays = 1;
     }
   }
   
   function renderModal() {
     setModalTabs();
     const body = document.getElementById('modalBody');
   
     if (modalStep === 1) { body.innerHTML = step1HTML(); bindStep1(); }
     if (modalStep === 2) { body.innerHTML = step2HTML(); bindStep2(); }
     if (modalStep === 3) { body.innerHTML = step3HTML(); bindStep3(); }
   }
   
   function setModalTabs() {
     ['step1tab','step2tab','step3tab'].forEach((id, i) => {
       const el = document.getElementById(id);
       el.classList.remove('active','done');
       if (i + 1 === modalStep) el.classList.add('active');
       if (i + 1 < modalStep)  el.classList.add('done');
     });
   }
   
   function carSummaryHTML() {
     const imgTag = currentCar.img
       ? `<img src="${currentCar.img}" alt="${currentCar.name}" />`
       : `<i class="bi bi-car-front-fill"></i>`;
     return `
     <div class="modal-car-summary">
       <div class="modal-car-img">${imgTag}</div>
       <div class="modal-car-info">
         <h4>${currentCar.name}</h4>
         <p>${currentCar.subtitle} &bull; ${currentCar.location}</p>
       </div>
       <div class="modal-car-price">${currentCar.currency} ${currentCar.price.toLocaleString()} <small>/day</small></div>
     </div>`;
   }
   
   function step1HTML() {
     const pDate = document.getElementById('pickupDate')?.value || '';
     const rDate = document.getElementById('returnDate')?.value || '';
     return `
     ${carSummaryHTML()}
     <div class="form-section-label"><i class="bi bi-calendar3-range"></i> Rental Period</div>
     <div class="form-row-2">
       <div class="form-group">
         <label>Pickup Date</label>
         <input type="date" id="m_pickup" value="${pDate}" />
       </div>
       <div class="form-group">
         <label>Return Date</label>
         <input type="date" id="m_return" value="${rDate}" />
       </div>
     </div>
     <div class="form-section-label"><i class="bi bi-person-fill"></i> Driver Details</div>
     <div class="form-row-2">
       <div class="form-group"><label>First Name</label><input type="text" id="m_fname" placeholder="Kwame" /></div>
       <div class="form-group"><label>Last Name</label><input type="text" id="m_lname" placeholder="Mensah" /></div>
     </div>
     <div class="form-row-2">
       <div class="form-group"><label>Phone Number</label><input type="tel" id="m_phone" placeholder="+233 20 000 0000" /></div>
       <div class="form-group"><label>Email Address</label><input type="email" id="m_email" placeholder="kwame@email.com" /></div>
     </div>
     <div class="form-group"><label>Driver's Licence Number</label><input type="text" id="m_licence" placeholder="GH-DL-XXXXXXX" /></div>
     <div class="modal-actions">
       <button class="btn-modal-next" id="step1Next">Continue <i class="bi bi-arrow-right"></i></button>
     </div>`;
   }
   
   function bindStep1() {
     document.getElementById('step1Next').addEventListener('click', () => {
       const fname   = document.getElementById('m_fname').value.trim();
       const lname   = document.getElementById('m_lname').value.trim();
       const phone   = document.getElementById('m_phone').value.trim();
       const email   = document.getElementById('m_email').value.trim();
       const licence = document.getElementById('m_licence').value.trim();
       const pickup  = document.getElementById('m_pickup').value;
       const ret     = document.getElementById('m_return').value;
   
       if (!fname || !lname || !phone || !email || !licence) {
         showToast('Please fill in all required fields', 'error'); return;
       }
       if (!pickup || !ret || new Date(ret) <= new Date(pickup)) {
         showToast('Please enter valid pickup and return dates', 'error'); return;
       }
       rentalDays = Math.round((new Date(ret) - new Date(pickup)) / 86400000) || 1;
       modalStep  = 2;
       renderModal();
     });
   }
   
   function step2HTML() {
     const options = Object.entries(INS).map(([key, val]) => `
     <label class="ins-option ${selectedIns === key ? 'selected' : ''}" data-ins="${key}">
       <input type="radio" name="insurance" value="${key}" ${selectedIns === key ? 'checked' : ''} />
       <div class="ins-info">
         <h5>${val.label}</h5>
         <p>${val.desc}</p>
       </div>
       <div class="ins-price">${val.price === 0 ? 'Free' : `GHS ${val.price}/day`}</div>
     </label>`).join('');
   
     return `
     ${carSummaryHTML()}
     <div class="form-section-label"><i class="bi bi-shield-check"></i> Insurance Coverage</div>
     <div class="insurance-opts">${options}</div>
     <div class="modal-actions">
       <button class="btn-modal-back" id="step2Back"><i class="bi bi-arrow-left"></i> Back</button>
       <button class="btn-modal-next" id="step2Next">Continue <i class="bi bi-arrow-right"></i></button>
     </div>`;
   }
   
   function bindStep2() {
     document.querySelectorAll('.ins-option').forEach(opt => {
       opt.addEventListener('click', () => {
         selectedIns = opt.dataset.ins;
         document.querySelectorAll('.ins-option').forEach(o => o.classList.remove('selected'));
         opt.classList.add('selected');
       });
     });
     document.getElementById('step2Back').addEventListener('click', () => { modalStep = 1; renderModal(); });
     document.getElementById('step2Next').addEventListener('click', () => { modalStep = 3; renderModal(); });
   }
   
   function step3HTML() {
     const baseTotal = currentCar.price * rentalDays;
     const insTotal  = INS[selectedIns].price * rentalDays;
     const grandTotal = baseTotal + insTotal;
   
     return `
     ${carSummaryHTML()}
     <div class="price-summary">
       <div class="price-summary-head"><i class="bi bi-receipt"></i> Price Breakdown</div>
       <div class="price-summary-body">
         <div class="price-line"><span>Daily rate</span><span>GHS ${currentCar.price.toLocaleString()}</span></div>
         <div class="price-line"><span>Rental duration</span><span>${rentalDays} day${rentalDays > 1 ? 's' : ''}</span></div>
         <div class="price-line"><span>Vehicle subtotal</span><span>GHS ${baseTotal.toLocaleString()}</span></div>
         <div class="price-line"><span>Insurance (${INS[selectedIns].label})</span><span>${insTotal === 0 ? 'Free' : 'GHS ' + insTotal.toLocaleString()}</span></div>
         <div class="price-total"><span>Total</span><span>GHS ${grandTotal.toLocaleString()}</span></div>
       </div>
     </div>
     <div class="modal-actions">
       <button class="btn-modal-back" id="step3Back"><i class="bi bi-arrow-left"></i> Back</button>
       <button class="btn-modal-next accent" id="confirmBtn">Confirm Booking <i class="bi bi-check-circle-fill"></i></button>
     </div>`;
   }
   
   function bindStep3() {
     document.getElementById('step3Back').addEventListener('click', () => { modalStep = 2; renderModal(); });
     document.getElementById('confirmBtn').addEventListener('click', () => {
       bookingRef = 'TAR-' + Math.random().toString(36).substr(2, 8).toUpperCase();
       showConfirmation();
     });
   }
   
   function showConfirmation() {
     const body = document.getElementById('modalBody');
     const pDate = document.getElementById('m_pickup')?.value || 'N/A';
     const rDate = document.getElementById('m_return')?.value || 'N/A';
     ['step1tab','step2tab','step3tab'].forEach(id => {
       const el = document.getElementById(id);
       el.classList.remove('active');
       el.classList.add('done');
     });
     body.innerHTML = `
     <div class="booking-confirmed">
       <i class="bi bi-check-circle-fill confirmed-icon"></i>
       <h3>Booking Confirmed!</h3>
       <p class="booking-ref">Reference: ${bookingRef}</p>
       <div class="confirmed-details">
         <div class="conf-row"><i class="bi bi-car-front-fill"></i><div><strong>Vehicle</strong><span>${currentCar.name}</span></div></div>
         <div class="conf-row"><i class="bi bi-calendar-event-fill"></i><div><strong>Pickup</strong><span>${pDate}</span></div></div>
         <div class="conf-row"><i class="bi bi-calendar-check-fill"></i><div><strong>Return</strong><span>${rDate}</span></div></div>
         <div class="conf-row"><i class="bi bi-shield-fill-check"></i><div><strong>Insurance</strong><span>${INS[selectedIns].label}</span></div></div>
       </div>
       <p style="font-size:.87rem;color:#5e7490;margin-bottom:24px">
         A confirmation will be sent to your email. Our team will contact you within 30 minutes.
       </p>
       <button class="confirm-done-btn" id="donBtn">Done</button>
     </div>`;
     document.getElementById('donBtn').addEventListener('click', () => {
       closeModal();
       showToast('Booking confirmed! Reference: ' + bookingRef, 'success');
     });
   }
   
   /* ── TOAST ── */
   function showToast(msg, type = 'info') {
     const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill', warning: 'bi-exclamation-triangle-fill' };
     const t = document.getElementById('toast');
     t.innerHTML = `<i class="bi ${icons[type] || icons.info}"></i> ${msg}`;
     t.className = `toast ${type} show`;
     clearTimeout(t._timer);
     t._timer = setTimeout(() => t.classList.remove('show'), 3500);
   }