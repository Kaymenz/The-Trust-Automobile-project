/* ═══════════════════════════════════════════════════════════
   AUTOPARTSPRO — SHARED APPLICATION LOGIC
   Ghana branding · localStorage cart · Toast system
═══════════════════════════════════════════════════════════ */

// ── PRODUCT DATABASE ──────────────────────────────────────
const PRODUCTS = [
  {
    id: 1, name: 'Toyota Corolla Brake Pads (Front)', brand: 'Bosch',
    category: 'brakes', price: 180, oldPrice: 220,
    rating: 4.8, reviews: 124, stock: 45, sku: 'BP-TOY-001',
    compatibility: 'Toyota Corolla 2010–2022',
    description: 'Premium Bosch front brake pads engineered for Toyota Corolla. Superior stopping power, low dust, reduced noise.',
    specs: { Material: 'Semi-metallic', 'Axle Position': 'Front', 'Pad Thickness': '12mm', Warranty: '1 Year' },
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75',
    badge: 'bestseller', featured: true
  },
  {
    id: 2, name: 'Engine Oil Filter — Universal', brand: 'Mann',
    category: 'engine', price: 45, oldPrice: null,
    rating: 4.6, reviews: 89, stock: 120, sku: 'EF-MAN-002',
    compatibility: 'Universal — Check fitment guide',
    description: 'Mann high-performance oil filter. Removes contaminants and prolongs engine life. OEM specification.',
    specs: { 'Filter Type': 'Spin-on', Diameter: '76mm', Height: '95mm', Warranty: '6 Months' },
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=75',
    badge: null, featured: true
  },
  {
    id: 3, name: 'Honda CR-V Shock Absorber (Rear Pair)', brand: 'KYB',
    category: 'suspension', price: 620, oldPrice: 750,
    rating: 4.7, reviews: 56, stock: 18, sku: 'SA-KYB-003',
    compatibility: 'Honda CR-V 2012–2020',
    description: 'KYB Excel-G rear shock absorbers. Restores vehicle handling and ride comfort to OEM specification.',
    specs: { Position: 'Rear (Pair)', Type: 'Gas-charged', 'Extended Length': '450mm', Warranty: '2 Years' },
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=75',
    badge: 'sale', featured: false
  },
  {
    id: 4, name: 'Car Battery 60Ah — Maintenance Free', brand: 'Exide',
    category: 'electrical', price: 550, oldPrice: null,
    rating: 4.5, reviews: 201, stock: 32, sku: 'BAT-EXI-004',
    compatibility: 'Universal — Various models',
    description: 'Sealed maintenance-free 60Ah battery. Reliable cold-cranking performance in Ghana\'s climate.',
    specs: { Capacity: '60Ah', CCA: '540A', Voltage: '12V', Warranty: '18 Months' },
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=75',
    badge: null, featured: true
  },
  {
    id: 5, name: 'Toyota Hilux Headlamp Assembly (Left)', brand: 'TYC',
    category: 'body', price: 420, oldPrice: 500,
    rating: 4.4, reviews: 38, stock: 9, sku: 'HL-TYC-005',
    compatibility: 'Toyota Hilux 2015–2021',
    description: 'OEM-spec replacement headlamp assembly. Direct bolt-on fit. Includes bulb socket wiring.',
    specs: { Side: 'Left (Driver)', Type: 'Halogen', Connector: 'H4', Warranty: '1 Year' },
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=75',
    badge: 'sale', featured: false
  },
  {
    id: 6, name: 'Alternator 90A — Rebuilt Exchange', brand: 'Valeo',
    category: 'electrical', price: 780, oldPrice: null,
    rating: 4.6, reviews: 44, stock: 7, sku: 'ALT-VAL-006',
    compatibility: 'Multi-fit — See compatibility chart',
    description: 'Factory-remanufactured Valeo 90A alternator. Tested to OEM specification. Exchange basis — return your old unit.',
    specs: { Output: '90A', Voltage: '12V', Rotation: 'CW', Warranty: '1 Year' },
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=75',
    badge: null, featured: false
  },
  {
    id: 7, name: 'Radiator — Nissan X-Trail 2.0', brand: 'KOYO',
    category: 'engine', price: 890, oldPrice: 1050,
    rating: 4.8, reviews: 27, stock: 5, sku: 'RAD-KOY-007',
    compatibility: 'Nissan X-Trail T31 2007–2013',
    description: 'KOYO aluminium radiator. Superior heat dissipation compared to OEM plastic tanks. Direct fit.',
    specs: { Material: 'Aluminium core', Rows: '2', Width: '640mm', Warranty: '2 Years' },
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=75',
    badge: 'sale', featured: false
  },
  {
    id: 8, name: 'Timing Belt Kit — Toyota 1KD/2KD', brand: 'Gates',
    category: 'engine', price: 340, oldPrice: null,
    rating: 4.9, reviews: 173, stock: 54, sku: 'TBK-GAT-008',
    compatibility: 'Toyota 1KD-FTV / 2KD-FTV Engine',
    description: 'Gates PowerGrip timing belt kit. Complete kit includes belt, idler, tensioner. Critical preventive maintenance.',
    specs: { 'Kit Contents': 'Belt + Idler + Tensioner', 'Change Interval': '60,000 km', Material: 'HNBR Rubber', Warranty: '1 Year' },
    image: 'https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=600&q=75',
    badge: 'bestseller', featured: true
  },
  {
    id: 9, name: 'Spark Plugs — Iridium Set of 4', brand: 'NGK',
    category: 'engine', price: 160, oldPrice: 190,
    rating: 4.7, reviews: 312, stock: 88, sku: 'SP-NGK-009',
    compatibility: 'Universal — Check application guide',
    description: 'NGK Iridium IX spark plugs. Ultra-fine iridium tip for reliable ignition, improved fuel economy.',
    specs: { Type: 'Iridium IX', Gap: '1.1mm', Thread: 'M14x1.25', Warranty: '80,000 km' },
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=75',
    badge: null, featured: false
  },
  {
    id: 10, name: 'Front Bumper Cover — Hyundai Tucson', brand: 'OEM Spec',
    category: 'body', price: 760, oldPrice: null,
    rating: 4.3, reviews: 19, stock: 4, sku: 'BMP-HYU-010',
    compatibility: 'Hyundai Tucson TL 2016–2020',
    description: 'Unpainted replacement front bumper cover. Primed and ready for paint matching. Direct OEM fit.',
    specs: { Finish: 'Primed', Material: 'PP Plastic', 'Includes Brackets': 'Yes', Warranty: '6 Months' },
    image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=75',
    badge: null, featured: false
  },
  {
    id: 11, name: 'Air Filter — High Performance Panel', brand: 'K&N',
    category: 'engine', price: 210, oldPrice: 245,
    rating: 4.8, reviews: 98, stock: 61, sku: 'AF-KAN-011',
    compatibility: 'Universal high-flow panel filter',
    description: 'K&N washable and reusable high-flow air filter. Increases horsepower and is designed to last the lifetime of the vehicle.',
    specs: { Type: 'Panel — washable', 'Flow Rate': '+5% over OEM', 'Clean Cycle': '80,000 km', Warranty: 'Lifetime' },
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=75',
    badge: 'bestseller', featured: false
  },
  {
    id: 12, name: 'Disc Brake Rotors — Ford Ranger (Pair)', brand: 'Brembo',
    category: 'brakes', price: 520, oldPrice: null,
    rating: 4.9, reviews: 41, stock: 12, sku: 'DBR-BRM-012',
    compatibility: 'Ford Ranger T6 / PX 2011–2020',
    description: 'Brembo UV-coated vented disc rotors. Anti-rust coating, cross-drilled for heat dissipation. Sold as a pair.',
    specs: { Diameter: '296mm', Thickness: '22mm', Vented: 'Yes', Warranty: '1 Year' },
    image: 'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=600&q=75',
    badge: null, featured: true
  }
];

const CATEGORIES = {
  engine:     { label: 'Engine Parts',    icon: 'fa-cogs',       count: PRODUCTS.filter(p=>p.category==='engine').length },
  brakes:     { label: 'Brake Systems',   icon: 'fa-stop-circle',count: PRODUCTS.filter(p=>p.category==='brakes').length },
  electrical: { label: 'Electrical',      icon: 'fa-bolt',       count: PRODUCTS.filter(p=>p.category==='electrical').length },
  body:       { label: 'Body Parts',      icon: 'fa-car-side',   count: PRODUCTS.filter(p=>p.category==='body').length },
  suspension: { label: 'Suspension',      icon: 'fa-car-crash',  count: PRODUCTS.filter(p=>p.category==='suspension').length },
};

// ── CART MANAGEMENT ───────────────────────────────────────
const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('ap_cart') || '[]'); } catch { return []; }
  },
  save(items) {
    localStorage.setItem('ap_cart', JSON.stringify(items));
    Cart.updateBadge();
  },
  add(productId, qty = 1) {
    const items = Cart.get();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 20);
    } else {
      const product = PRODUCTS.find(p => p.id === productId);
      if (!product) return;
      items.push({ id: productId, qty });
    }
    Cart.save(items);
    showToast('Added to cart!', 'fa-cart-plus');
  },
  remove(productId) {
    Cart.save(Cart.get().filter(i => i.id !== productId));
  },
  updateQty(productId, qty) {
    const items = Cart.get();
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = Math.max(1, Math.min(qty, 20)); Cart.save(items); }
  },
  total() {
    return Cart.get().reduce((sum, item) => {
      const p = PRODUCTS.find(x => x.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  },
  count() { return Cart.get().reduce((s, i) => s + i.qty, 0); },
  clear() { localStorage.removeItem('ap_cart'); Cart.updateBadge(); },
  updateBadge() {
    document.querySelectorAll('.cart-count').forEach(el => {
      const n = Cart.count();
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
  }
};

// ── ORDERS MANAGEMENT ─────────────────────────────────────
const Orders = {
  get() {
    try { return JSON.parse(localStorage.getItem('ap_orders') || '[]'); } catch { return []; }
  },
  save(orders) { localStorage.setItem('ap_orders', JSON.stringify(orders)); },
  add(orderData) {
    const orders = Orders.get();
    const id = 'ORD-' + Date.now().toString(36).toUpperCase();
    orders.unshift({ id, date: new Date().toLocaleDateString('en-GH'), status: 'pending', ...orderData });
    Orders.save(orders);
    return id;
  }
};

// ── TOAST SYSTEM ──────────────────────────────────────────
function showToast(message, icon = 'fa-check-circle') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── PRODUCT CARD HTML ──────────────────────────────────────
function productCardHTML(product) {
  const badgeHTML = product.badge
    ? `<span class="product-badge ${product.badge === 'sale' ? 'sale' : product.badge === 'bestseller' ? '' : 'featured'}">${product.badge}</span>`
    : '';
  const oldPriceHTML = product.oldPrice
    ? `<div class="product-price-old">GHS ${product.oldPrice.toFixed(2)}</div>`
    : '';
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
  return `
  <div class="product-card reveal">
    <div class="product-img">
      <img src="${product.image}" alt="${product.name}" loading="lazy"
           onerror="this.parentElement.innerHTML='<div class=product-img-placeholder><i class=fas fa-cog></i></div>'" />
      ${badgeHTML}
    </div>
    <div class="product-body">
      <div class="product-category">${CATEGORIES[product.category]?.label || product.category}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-brand">${product.brand}</div>
      <div class="product-rating">
        <span class="stars">${stars}</span>
        <span class="rating-count">(${product.reviews})</span>
      </div>
      <div class="product-footer">
        <div>
          <div class="product-price">GHS ${product.price.toFixed(2)}</div>
          ${oldPriceHTML}
        </div>
        <button class="btn-add-cart" onclick="Cart.add(${product.id}); event.stopPropagation();">
          <i class="fas fa-cart-plus"></i> Add
        </button>
      </div>
    </div>
  </div>`;
}

// ── MOBILE MENU ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();

  // Mobile drawer toggle
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => drawer.classList.toggle('open'));
  }

  // Search
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  if (searchBtn && searchInput) {
    const doSearch = () => {
      const q = searchInput.value.trim();
      if (q) window.location = `products.html?search=${encodeURIComponent(q)}`;
    };
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  }

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Stagger product cards
  document.querySelectorAll('.products-grid .product-card').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
  });
});

// ── FORMAT CURRENCY ───────────────────────────────────────
function formatGHS(amount) {
  return 'GHS ' + parseFloat(amount).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
