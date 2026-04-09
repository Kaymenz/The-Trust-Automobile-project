/**
 * Trust Automobile — Live Sync  (v2 — full refresh build)
 * ═══════════════════════════════════════════════════════════════
 * Drop  <script src="ta-live-sync.js"></script>  at the BOTTOM of
 * any public page (after all other scripts).
 *
 * What changed in v2 vs v1:
 *  • Every injector marks its cards with data-live="TYPE" then
 *    REMOVES them before re-rendering → zero duplicates on refresh.
 *  • injectSpareParts() targets BOTH #featured-products (spare.html)
 *    AND #products-grid / .products-grid (products.html).
 *  • Hero counters (sc1–sc4) auto-update from live part count.
 *  • window.storage event → cross-tab live sync (open dashboard in
 *    tab A, see changes in spare.html tab B immediately).
 *  • visibilitychange → re-render when user tabs back.
 *
 * Storage keys (written by dashboards, read here):
 *   ta_spare_parts       – parts catalogue  (portal-parts → spare.html / products.html)
 *   ta_videos            – video hub        (any portal → education.html)
 *   ta_mechanic_services – mechanic listings
 *   ta_cars_rent         – rental fleet
 *   ta_listing_*         – per-seller car listings
 * ═══════════════════════════════════════════════════════════════
 */
 ;(function () {
  'use strict';

  /* ── helpers ─────────────────────────────────────────────── */
  function dbGet(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (_) { return []; }
  }
  function timeAgo(iso) {
    if (!iso) return '';
    const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    if (d < 30)  return d + 'd ago';
    return Math.floor(d / 30) + 'mo ago';
  }
  function esc(str) {
    return String(str || '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── video helpers ───────────────────────────────────────── */
  const VID = {
    ytId : u => { const m=(u||'').match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/); return m?m[1]:null; },
    vmId : u => { const m=(u||'').match(/vimeo\.com\/(\d+)/); return m?m[1]:null; },
    thumb: u => {
      const y=VID.ytId(u); if(y) return 'https://img.youtube.com/vi/'+y+'/mqdefault.jpg';
      const v=VID.vmId(u); if(v) return 'https://vumbnail.com/'+v+'.jpg';
      return '';
    },
    embed: u => {
      const y=VID.ytId(u); if(y) return 'https://www.youtube.com/embed/'+y+'?autoplay=1';
      const v=VID.vmId(u); if(v) return 'https://player.vimeo.com/video/'+v+'?autoplay=1';
      return '';
    }
  };

  /* ══════════════════════════════════════════════════════════
     1.  VIDEOS  →  education.html
         Target: #video-grid  OR  .vid-grid  OR  [id*="vid"][id*="grid"]
         Marks each injected card with data-live="videos" so
         re-runs can remove stale cards before re-adding.
  ══════════════════════════════════════════════════════════ */
  function injectVideos() {
    var grid = document.getElementById('video-grid')
      || document.querySelector('[id*="vid"][id*="grid"]')
      || document.querySelector('.vid-grid');
    if (!grid) return;

    // Remove stale injected cards
    grid.querySelectorAll('[data-live="videos"]').forEach(function(el){ el.remove(); });

    var videos = dbGet('ta_videos');
    if (!videos.length) return;

    // Remove "no videos" placeholder if present
    var empty = grid.querySelector('p');
    if (empty && empty.textContent.trim().toLowerCase().startsWith('no')) empty.remove();

    var frag = document.createDocumentFragment();
    var roleBgMap = { mechanic:'#1A7A3A', seller:'#1A4B8C', renter:'#0B1E3D' };
    var roleLblMap= { mechanic:'Mechanic', seller:'Car Seller', renter:'Car Renter' };

    videos.forEach(function(v) {
      var thumb    = v.thumbnail || VID.thumb(v.url) || 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=70';
      var roleBg   = roleBgMap[v.role] || '#7A3A00';
      var roleLbl  = roleLblMap[v.role] || 'Parts Dealer';
      var safeUrl  = esc(v.url   || '');
      var safeTitle= esc(v.title || 'Untitled');

      var card = document.createElement('div');
      card.className   = 'video-card';
      card.dataset.live= 'videos';
      card.style.cssText = 'background:#fff;border-radius:10px;border:1px solid #DDE4EF;overflow:hidden;transition:all .2s;cursor:pointer;';

      card.innerHTML =
        '<div style="position:relative;padding-top:56.25%;background:#0B1E3D;overflow:hidden;">' +
          '<img src="'+esc(thumb)+'" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'" />' +
          '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(11,30,61,.35);">' +
            '<div style="width:50px;height:50px;border-radius:50%;background:rgba(232,160,32,.9);display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#0B1E3D;">&#9654;</div>' +
          '</div>' +
          (v.duration ? '<span style="position:absolute;bottom:8px;right:8px;background:rgba(11,30,61,.8);color:#fff;font-size:.66rem;font-weight:700;padding:2px 7px;border-radius:4px;">'+esc(v.duration)+'</span>' : '') +
          '<span style="position:absolute;top:8px;left:8px;background:'+roleBg+';color:#fff;font-size:.62rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:100px;">'+roleLbl+'</span>' +
          (v.new ? '<span style="position:absolute;top:8px;right:8px;background:#E8A020;color:#0B1E3D;font-size:.62rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:100px;">New</span>' : '') +
        '</div>' +
        '<div style="padding:13px 15px;">' +
          '<div style="font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:.95rem;color:#0B1E3D;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="'+safeTitle+'">'+safeTitle+'</div>' +
          '<div style="font-size:.75rem;color:#8FA3BD;margin-bottom:8px;">'+esc(v.poster||'')+' &nbsp;&middot;&nbsp; '+timeAgo(v.postedAt)+'</div>' +
          '<button onclick="event.stopPropagation();window._taPlayVideo(\''+safeUrl+'\',\''+safeTitle+'\')" style="background:#E8A020;color:#0B1E3D;border:none;padding:7px 14px;border-radius:6px;font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:.76rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;">&#9654; Watch</button>' +
        '</div>';

      card.addEventListener('click', function(){ window._taPlayVideo(v.url, v.title); });
      frag.appendChild(card);
    });

    grid.prepend(frag);
    _ensureLightbox();
  }

  /* ══════════════════════════════════════════════════════════
     2.  SPARE PARTS  →  spare.html  AND  products.html
         Targets (tried in order):
           #featured-products   spare.html hero grid
           #products-grid       products.html catalogue
           .products-grid       fallback
         De-duplicates across multiple matching grids.
         Marks injected cards data-live="parts" for clean refresh.
  ══════════════════════════════════════════════════════════ */
  function injectSpareParts() {
    var candidates = [
      document.getElementById('featured-products'),
      document.getElementById('products-grid'),
      document.querySelector('.products-grid')
    ].filter(Boolean);

    // Deduplicate
    var seen  = [];
    var grids = [];
    candidates.forEach(function(g){
      if (seen.indexOf(g) === -1) { seen.push(g); grids.push(g); }
    });
    if (!grids.length) return;

    var parts = dbGet('ta_spare_parts');

    grids.forEach(function(grid) {
      // Remove stale injected cards
      grid.querySelectorAll('[data-live="parts"]').forEach(function(el){ el.remove(); });
      if (!parts.length) return;

      var frag = document.createDocumentFragment();

      parts.forEach(function(p) {
        var price       = Number(p.price  || 0).toLocaleString();
        var stock       = Number(p.stock  || 0);
        var lowMark     = Number(p.lowStock || 5);
        var stockColour = stock === 0 ? '#D63B3B' : stock <= lowMark ? '#E8A020' : '#1A7A3A';
        var stockLabel  = stock === 0 ? 'Out of Stock' : stock <= lowMark ? 'Low Stock' : 'In Stock';
        var catLabel    = (p.cat || '').replace(/_/g,' ');
        // Safely serialize part for onclick (avoid quote injection)
        var partJson    = JSON.stringify(p);

        var card = document.createElement('div');
        card.className      = 'product-card';
        card.dataset.live   = 'parts';
        card.dataset.partId = p.id || '';

        card.innerHTML =
          '<div class="product-img" style="position:relative;overflow:hidden;height:190px;background:#F4F7FB;">' +
            (p.image
              ? '<img src="'+esc(p.image)+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'" />'
              : '<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:2.8rem;color:#8FA3BD;">&#128295;</div>') +
            '<span style="position:absolute;top:10px;left:10px;background:'+stockColour+';color:#fff;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;border-radius:100px;">'+stockLabel+'</span>' +
            (p.cond === 'new' ? '<span style="position:absolute;top:10px;right:10px;background:#E8A020;color:#0B1E3D;font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:100px;">New</span>' : '') +
          '</div>' +
          '<div class="product-body">' +
            '<div class="product-category">'+esc(catLabel)+'</div>' +
            '<div class="product-name">'+esc(p.name || 'Auto Part')+'</div>' +
            '<div class="product-brand">'+esc(p.brand||'')+(p.partno ? ' &middot; '+esc(p.partno) : '')+'</div>' +
            '<div style="font-size:.76rem;color:#5E7490;margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="'+esc(p.compat||'')+'">'+esc(p.compat||'')+'</div>' +
            '<div class="product-footer">' +
              '<div>' +
                '<div class="product-price">GHS '+price+'</div>' +
                '<div style="font-size:.74rem;color:#5E7490;">'+esc(p.dealerName||'Dealer')+'</div>' +
              '</div>' +
              '<button class="btn-add-cart" data-part-id="'+esc(p.id||'')+'">&#43; Cart</button>' +
            '</div>' +
          '</div>';

        // Add-to-cart handler (avoids inline JSON injection risk)
        card.querySelector('.btn-add-cart').addEventListener('click', function(e){
          e.stopPropagation();
          if (typeof window._taAddToCart === 'function') { window._taAddToCart(p); }
          else { alert('Cart is not available on this page.'); }
        });

        // Hover
        card.addEventListener('mouseenter', function(){ card.style.transform='translateY(-4px)'; card.style.boxShadow='0 12px 36px rgba(11,30,61,.12)'; });
        card.addEventListener('mouseleave', function(){ card.style.transform=''; card.style.boxShadow=''; });

        frag.appendChild(card);
      });

      grid.prepend(frag);
    });

    _updateHeroCounters();
  }

  /* ── Hero counter animation (spare.html) ────────────────── */
  function _updateHeroCounters() {
    var parts   = dbGet('ta_spare_parts');
    var dealers = {};
    var brands  = {};
    var sold    = 0;
    parts.forEach(function(p){
      if (p.dealerId) dealers[p.dealerId] = true;
      if (p.brand)    brands[p.brand]     = true;
      sold += Number(p.sold || 0);
    });

    var targets = {
      sc1: Math.max(parts.length, 10),
      sc2: Math.max(Object.keys(dealers).length, 1),
      sc3: Math.max(Object.keys(brands).length,  4),
      sc4: Math.max(sold, 50)
    };

    Object.keys(targets).forEach(function(id){
      var el = document.getElementById(id);
      if (!el) return;
      var target  = targets[id];
      var current = parseInt(el.textContent) || 0;
      if (current === target) return;
      _animCount(el, target);
    });
  }

  function _animCount(el, target) {
    var n = 0;
    var step   = target / 50;
    var suffix = target >= 100 ? '+' : '';
    clearInterval(el._countTimer);
    el._countTimer = setInterval(function(){
      n = Math.min(n + step, target);
      el.textContent = Math.round(n) + suffix;
      if (n >= target) clearInterval(el._countTimer);
    }, 22);
  }

  /* ══════════════════════════════════════════════════════════
     3. MECHANICS  →  mechanic.html
  ══════════════════════════════════════════════════════════ */
  function injectMechanics() {
    var grid = document.getElementById('mechanics-grid');
    if (!grid) return;
    grid.querySelectorAll('[data-live="mechanics"]').forEach(function(el){ el.remove(); });
    var services = dbGet('ta_mechanic_services');
    if (!services.length) return;
    var map = {};
    services.forEach(function(s){
      if (!map[s.mechanicId]) map[s.mechanicId] = { id:s.mechanicId, name:s.mechanicName||'Mechanic', region:s.region||'', services:[] };
      map[s.mechanicId].services.push(s);
    });
    var frag = document.createDocumentFragment();
    Object.values(map).forEach(function(m){
      var initials = m.name.split(' ').map(function(w){ return w[0]; }).join('').substring(0,2).toUpperCase();
      var svcList  = m.services.slice(0,3).map(function(s){
        var price = s.ptype==='free' ? 'Free' : s.ptype==='negotiable' ? 'GHS '+s.price+' (Neg.)' : 'GHS '+s.price;
        return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F4F7FB;font-size:.82rem;"><span style="color:#1C2B40;">'+esc(s.name)+'</span><span style="font-family:\'Barlow Condensed\',sans-serif;font-weight:700;color:'+(s.ptype==='free'?'#1A7A3A':'#0B1E3D')+';">'+price+'</span></div>';
      }).join('');
      var card = document.createElement('div');
      card.dataset.live = 'mechanics';
      card.style.cssText = 'background:#fff;border-radius:12px;border:1.5px solid #E8A020;overflow:hidden;display:grid;grid-template-columns:1fr auto;transition:all .3s;margin-bottom:18px;';
      card.innerHTML =
        '<div style="padding:20px;"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">'+
        '<div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,#E8A020,#F5C05A);display:flex;align-items:center;justify-content:center;font-family:\'Bebas Neue\',cursive;font-size:1.3rem;color:#0B1E3D;flex-shrink:0;">'+initials+'</div>'+
        '<div><div style="font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:1.1rem;color:#0B1E3D;">'+esc(m.name)+' <span style="background:rgba(26,122,58,.1);color:#1A7A3A;font-size:.62rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:2px 8px;border-radius:100px;margin-left:6px;">&#10003; Verified</span></div>'+
        '<div style="font-size:.8rem;color:#5E7490;margin-top:2px;">&#128205; '+esc(m.region||'Ghana')+'</div></div></div>'+
        '<div style="font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#8FA3BD;margin-bottom:6px;">Services &amp; Prices</div>'+
        svcList+(m.services.length>3?'<div style="font-size:.76rem;color:#5E7490;margin-top:6px;">+'+(m.services.length-3)+' more services</div>':'')+
        '</div>'+
        '<div style="padding:20px;border-left:1px solid #EEF2F8;display:flex;flex-direction:column;gap:8px;justify-content:center;min-width:160px;">'+
        '<span style="background:#E8A020;color:#0B1E3D;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 10px;border-radius:100px;text-align:center;">New Member</span>'+
        '<button style="background:#E8A020;color:#0B1E3D;border:none;padding:10px 14px;border-radius:8px;font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;">&#128197; Book Now</button>'+
        '<button onclick="this.textContent=this.textContent.includes(\'Show\')?\''+esc(m.phone||'+233 XX XXX XXXX')+'\'  :\'&#128222; Show Contact\'" style="background:transparent;color:#0B1E3D;border:1.5px solid #DDE4EF;padding:9px 14px;border-radius:8px;font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;">&#128222; Show Contact</button>'+
        '</div>';
      frag.appendChild(card);
    });
    grid.prepend(frag);
  }

  /* ══════════════════════════════════════════════════════════
     4. SELLER LISTINGS  →  sell / cars-for-sale page
  ══════════════════════════════════════════════════════════ */
  function injectSellerListings() {
    var grid = document.getElementById('listings-grid')
      || document.querySelector('.listings-grid')
      || document.querySelector('#cars-grid')
      || document.querySelector('.cars-grid');
    if (!grid) return;
    grid.querySelectorAll('[data-live="listings"]').forEach(function(el){ el.remove(); });
    var allListings = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.startsWith('ta_listing_')) {
        dbGet(key).forEach(function(l){ if (l.status === 'active') allListings.push(l); });
      }
    }
    if (!allListings.length) return;
    var frag = document.createDocumentFragment();
    allListings.forEach(function(l){
      var img = l.images && l.images[0] ? l.images[0] : '';
      var card = document.createElement('div');
      card.dataset.live = 'listings';
      card.style.cssText = 'background:#fff;border-radius:12px;border:1px solid #DDE4EF;overflow:hidden;transition:all .3s;display:flex;flex-direction:column;';
      card.innerHTML =
        '<div style="position:relative;height:190px;background:#F4F7FB;overflow:hidden;">'+(img?'<img src="'+esc(img)+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'" />'
        :'<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;color:#8FA3BD;">&#128663;</div>')+
        '<span style="position:absolute;top:10px;left:10px;background:#1A7A3A;color:#fff;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:3px 9px;border-radius:100px;">Active</span></div>'+
        '<div style="padding:14px 16px;flex:1;display:flex;flex-direction:column;">'+
        '<div style="font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:1.05rem;color:#0B1E3D;margin-bottom:3px;">'+esc(l.year||'')+' '+esc(l.make||'')+' '+esc(l.model||'')+'</div>'+
        '<div style="font-family:\'Bebas Neue\',cursive;font-size:1.5rem;color:#0B1E3D;letter-spacing:.04em;margin-bottom:8px;">GHS '+Number(l.price||0).toLocaleString()+'</div>'+
        '<div style="font-size:.74rem;color:#5E7490;margin-top:auto;padding-top:10px;border-top:1px solid #EEF2F8;">'+esc(l.sellerName||'Seller')+' &middot; '+esc(l.region||'Ghana')+'</div>'+
        '<button style="margin-top:10px;width:100%;background:#0B1E3D;color:#fff;border:none;padding:10px;border-radius:8px;font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;">View Details</button></div>';
      frag.appendChild(card);
    });
    grid.prepend(frag);
  }

  /* ══════════════════════════════════════════════════════════
     5. RENTALS  →  rent.html
  ══════════════════════════════════════════════════════════ */
  function injectRentals() {
    var grid = document.getElementById('cars-grid')
      || document.querySelector('.cars-grid')
      || document.querySelector('.fleet-grid')
      || document.querySelector('#rent-grid');
    if (!grid) return;
    grid.querySelectorAll('[data-live="rentals"]').forEach(function(el){ el.remove(); });
    var cars = dbGet('ta_cars_rent');
    if (!cars.length) return;
    var AVBG = {
      available  :{ bg:'rgba(26,122,58,.12)', color:'#1A7A3A', border:'rgba(26,122,58,.3)' },
      booked     :{ bg:'rgba(214,59,59,.08)', color:'#D63B3B', border:'rgba(214,59,59,.2)' },
      maintenance:{ bg:'rgba(232,160,32,.1)',  color:'#8A5A00', border:'rgba(232,160,32,.25)'}
    };
    var frag = document.createDocumentFragment();
    cars.forEach(function(c){
      var av = AVBG[c.availability] || AVBG.available;
      var card = document.createElement('div');
      card.dataset.live = 'rentals';
      card.style.cssText = 'background:#fff;border-radius:12px;border:1px solid #DDE4EF;overflow:hidden;transition:all .3s;display:flex;flex-direction:column;';
      card.innerHTML =
        '<div style="position:relative;height:180px;background:#F4F7FB;overflow:hidden;">'+(c.image?'<img src="'+esc(c.image)+'" loading="lazy" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display=\'none\'" />':'<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;color:#8FA3BD;">&#128663;</div>')+
        '<span style="position:absolute;top:10px;right:10px;background:'+av.bg+';color:'+av.color+';border:1px solid '+av.border+';font-size:.62rem;font-weight:700;font-family:\'Barlow Condensed\',sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:100px;">'+(c.availability||'Available')+'</span>'+
        '<div style="position:absolute;bottom:10px;left:10px;background:rgba(11,30,61,.82);color:#fff;font-family:\'Bebas Neue\',cursive;font-size:1rem;letter-spacing:.04em;padding:3px 10px;border-radius:100px;">GHS '+Number(c.rate||0).toLocaleString()+'<span style="font-size:.62rem;opacity:.7;font-family:\'Barlow Condensed\',sans-serif;">/day</span></div></div>'+
        '<div style="padding:14px 16px;flex:1;display:flex;flex-direction:column;">'+
        '<div style="font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:1.05rem;color:#0B1E3D;margin-bottom:4px;">'+esc(c.year||'')+' '+esc(c.make||'')+' '+esc(c.model||'')+'</div>'+
        '<div style="font-size:.74rem;color:#5E7490;margin-top:auto;padding-top:10px;border-top:1px solid #EEF2F8;">&#128663; '+esc(c.renterName||'Fleet Operator')+'</div>'+
        '<button style="margin-top:10px;width:100%;background:#1A4B8C;color:#fff;border:none;padding:10px;border-radius:8px;font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;"'+(c.availability!=='available'?' disabled style="opacity:.5;cursor:not-allowed;"':'')+'>'+(c.availability==='available'?'&#128197; Book Now':c.availability==='booked'?'Currently Booked':'In Maintenance')+'</button></div>';
      frag.appendChild(card);
    });
    grid.prepend(frag);
  }

  /* ══════════════════════════════════════════════════════════
     LIGHTBOX  (shared by video cards)
  ══════════════════════════════════════════════════════════ */
  function _ensureLightbox() {
    if (window._taPlayVideo) return;
    window._taPlayVideo = function(url, title) {
      var embed = VID.embed(url);
      if (!embed) return;
      var lb = document.getElementById('_ta_lb');
      if (!lb) {
        lb = document.createElement('div');
        lb.id = '_ta_lb';
        lb.style.cssText = 'position:fixed;inset:0;background:rgba(6,15,30,.92);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
        lb.innerHTML =
          '<div style="width:100%;max-width:900px;position:relative;">'+
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'+
          '<span id="_ta_lb_title" style="font-family:\'Barlow Condensed\',sans-serif;font-weight:700;font-size:1.1rem;color:#fff;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></span>'+
          '<button onclick="document.getElementById(\'_ta_lb\').style.display=\'none\';document.getElementById(\'_ta_lb_iframe\').src=\'\';document.body.style.overflow=\'\';" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.12);border:none;color:#fff;font-size:1.1rem;cursor:pointer;margin-left:12px;">&#10005;</button>'+
          '</div>'+
          '<div style="position:relative;padding-top:56.25%;background:#000;border-radius:10px;overflow:hidden;">'+
          '<iframe id="_ta_lb_iframe" style="position:absolute;inset:0;width:100%;height:100%;border:none;" allowfullscreen allow="autoplay;fullscreen"></iframe>'+
          '</div></div>';
        lb.addEventListener('click', function(e){
          if (e.target === lb) { lb.style.display='none'; document.getElementById('_ta_lb_iframe').src=''; document.body.style.overflow=''; }
        });
        document.body.appendChild(lb);
        document.addEventListener('keydown', function(e){
          if (e.key==='Escape') { lb.style.display='none'; var f=document.getElementById('_ta_lb_iframe'); if(f) f.src=''; document.body.style.overflow=''; }
        });
      }
      document.getElementById('_ta_lb_title').textContent = title || '';
      document.getElementById('_ta_lb_iframe').src = embed;
      lb.style.display  = 'flex';
      document.body.style.overflow = 'hidden';
    };
  }

  /* ══════════════════════════════════════════════════════════
     MAIN — auto-detect page and run all injectors
     Each injector only acts if its target element exists.
  ══════════════════════════════════════════════════════════ */
  function run() {
    injectVideos();
    injectSpareParts();
    injectMechanics();
    injectSellerListings();
    injectRentals();
  }

  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  /* ── Re-run triggers ─────────────────────────────────────
     Tab becomes visible again (user returns from dashboard)
  ──────────────────────────────────────────────────────── */
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'visible') run();
  });

  /* Cross-tab: another tab (dashboard) wrote to localStorage */
  window.addEventListener('storage', function(e){
    if (!e.key) return;
    if (e.key === 'ta_spare_parts')         injectSpareParts();
    if (e.key === 'ta_videos')              injectVideos();
    if (e.key === 'ta_mechanic_services')   injectMechanics();
    if (e.key === 'ta_cars_rent')           injectRentals();
    if (e.key.startsWith('ta_listing_'))    injectSellerListings();
  });

})();

