/* ═══════════════════════════════════════════════════════════
   PORTAL SHARED — Trust Automobile Ghana
   Shared utilities for all stakeholder portals.
   No CSS variables — all direct hex values.
═══════════════════════════════════════════════════════════ */

/* ── PALETTE ──────────────────────────────────────────────
   Navy  #0B1E3D  Blue  #1A4B8C  Gold   #E8A020
   LGold #F5C05A  Steel #8FA3BD  BG     #F4F7FB
   White #FFFFFF  Text  #1C2B40  Muted  #5E7490
   Border #DDE4EF Green #1A7A3A  Red    #D63B3B
─────────────────────────────────────────────────────────── */

/* ── SESSION ─────────────────────────────────────────────── */
const PS = {
    getSession() {
      try { return JSON.parse(localStorage.getItem('ta_session')); } catch { return null; }
    },
    clearSession() { localStorage.removeItem('ta_session'); },
  
    /* Guard — call at top of every portal page */
    requireRole(expectedRole) {
      const s = this.getSession();
      if (!s) { window.location.href = 'login.html'; return null; }
      if (s.status === 'pending')  { window.location.href = 'login.html?status=pending'; return null; }
      if (s.status === 'blocked')  { window.location.href = 'login.html?status=blocked'; return null; }
      if (expectedRole && s.role !== expectedRole) { window.location.href = 'login.html'; return null; }
      return s;
    },
  };
  
  /* ── DATA STORES ─────────────────────────────────────────── */
  const DB = {
    get(key)        { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } },
    set(key, val)   { localStorage.setItem(key, JSON.stringify(val)); },
    add(key, item)  { const a = this.get(key); a.unshift(item); this.set(key, a); },
    del(key, id)    { this.set(key, this.get(key).filter(x => x.id !== id)); },
    upd(key, item)  { this.set(key, this.get(key).map(x => x.id === item.id ? { ...x, ...item } : x)); },
    find(key, id)   { return this.get(key).find(x => x.id === id); },
    uid()           { return Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase(); },
  };
  
  /* ── VIDEO UTILS ─────────────────────────────────────────── */
  const VID = {
    parseYtId(url) {
      const m = (url||'').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_\-]{11})/);
      return m ? m[1] : null;
    },
    parseVimeoId(url) {
      const m = (url||'').match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return m ? m[1] : null;
    },
    thumb(url) {
      const yt = this.parseYtId(url);
      if (yt) return `https://img.youtube.com/vi/${yt}/mqdefault.jpg`;
      const vm = this.parseVimeoId(url);
      if (vm) return `https://vumbnail.com/${vm}.jpg`;
      return '';
    },
    embed(url) {
      const yt = this.parseYtId(url);
      if (yt) return `https://www.youtube.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1`;
      const vm = this.parseVimeoId(url);
      if (vm) return `https://player.vimeo.com/video/${vm}?autoplay=1`;
      return '';
    },
    isValid(url) { return !!(this.parseYtId(url) || this.parseVimeoId(url)); },
    platform(url) { return this.parseYtId(url) ? 'YouTube' : this.parseVimeoId(url) ? 'Vimeo' : null; },
  };
  
  /* ── TOAST ───────────────────────────────────────────────── */
  function showToast(msg, type = 'success') {
    let t = document.getElementById('ps-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'ps-toast';
      t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0B1E3D;color:#fff;padding:12px 18px;border-radius:8px;font-family:Barlow Condensed,sans-serif;font-weight:600;font-size:.86rem;letter-spacing:.04em;box-shadow:0 8px 28px rgba(11,30,61,.3);z-index:9999;transform:translateY(80px);opacity:0;transition:all .35s;display:flex;align-items:center;gap:9px;max-width:340px;';
      t.innerHTML = '<i></i><span></span>';
      document.body.appendChild(t);
    }
    t.querySelector('span').textContent = msg;
    const ic = t.querySelector('i');
    ic.className = type === 'error' ? 'bi bi-exclamation-circle-fill' : 'bi bi-check-circle-fill';
    t.style.background = type === 'error' ? '#D63B3B' : '#0B1E3D';
    t.style.transform = 'translateY(0)'; t.style.opacity = '1';
    clearTimeout(window._psTT);
    window._psTT = setTimeout(() => { t.style.transform = 'translateY(80px)'; t.style.opacity = '0'; }, 3200);
  }
  
  /* ── PORTAL NAV RENDERER ─────────────────────────────────── */
  function renderPortalNav(role, session) {
    const ROLE_META = {
      seller:   { label:'Car Seller Portal',    icon:'bi-car-front-fill',   colour:'#1A7A3A' },
      renter:   { label:'Car Renter Portal',    icon:'bi-key-fill',         colour:'#1A4B8C' },
      mechanic: { label:'Mechanic Portal',      icon:'bi-tools',            colour:'#E8A020' },
      parts:    { label:'Parts Dealer Portal',  icon:'bi-box-seam-fill',    colour:'#8B4513' },
    };
    const meta = ROLE_META[role] || { label:'Portal', icon:'bi-person-fill', colour:'#0B1E3D' };
    const name = session ? `${session.firstName||''} ${session.lastName||''}`.trim() : '';
    return `
    <nav style="background:#0B1E3D;position:sticky;top:0;z-index:200;box-shadow:0 2px 20px rgba(0,0,0,.3);">
      <div style="max-width:1340px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:12px 28px;gap:16px;">
        <a href="index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;">
          <div style="width:34px;height:34px;background:#E8A020;border-radius:5px;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',cursive;font-size:1.1rem;color:#0B1E3D;flex-shrink:0;">TA</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.95rem;color:#fff;letter-spacing:.06em;line-height:1.1;">
            Trust Automobile<small style="display:block;font-size:.58rem;font-weight:400;color:#8FA3BD;letter-spacing:.14em;">${meta.label}</small>
          </div>
        </a>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-family:'Barlow Condensed',sans-serif;font-size:.82rem;color:rgba(255,255,255,.6);letter-spacing:.04em;">
            <i class="bi ${meta.icon}" style="color:${meta.colour};margin-right:5px;"></i>${name}
          </span>
          <a href="index.html" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;padding:7px 14px;border-radius:6px;border:1.5px solid rgba(255,255,255,.25);color:rgba(255,255,255,.8);text-decoration:none;transition:all .2s;" onmouseover="this.style.borderColor='#E8A020';this.style.color='#E8A020'" onmouseout="this.style.borderColor='rgba(255,255,255,.25)';this.style.color='rgba(255,255,255,.8)'">
            <i class="bi bi-globe"></i> Public Site
          </a>
          <button onclick="portalLogout()" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;padding:7px 14px;border-radius:6px;border:none;background:rgba(214,59,59,.18);color:#ff8080;cursor:pointer;transition:all .2s;" onmouseover="this.style.background='#D63B3B';this.style.color='#fff'" onmouseout="this.style.background='rgba(214,59,59,.18)';this.style.color='#ff8080'">
            <i class="bi bi-box-arrow-left"></i> Logout
          </button>
        </div>
      </div>
    </nav>`;
  }
  
  function portalLogout() {
    PS.clearSession();
    window.location.href = 'login.html';
  }
  
  /* ── PORTAL SIDEBAR RENDERER ─────────────────────────────── */
  function renderPortalSidebar(items, activeKey) {
    return items.map(item => `
      <div class="ps-nav-item${item.key === activeKey ? ' active' : ''}" onclick="showSection('${item.key}')" data-key="${item.key}">
        <i class="bi ${item.icon}"></i> ${item.label}
      </div>`).join('');
  }
  
  /* ── VIDEO CARD HTML ─────────────────────────────────────── */
  function videoCardHTML(v, onDelete) {
    const thumb = VID.thumb(v.url);
    const plat  = VID.platform(v.url) || 'Video';
    return `
    <div style="background:#FFFFFF;border-radius:10px;border:1px solid #DDE4EF;overflow:hidden;transition:all .3s;" onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 30px rgba(11,30,61,.1)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
      <div style="position:relative;padding-top:56.25%;background:#0B1E3D;cursor:pointer;" onclick="playPortalVideo('${v.url}','${(v.title||'').replace(/'/g,'\\'')}')">
        ${thumb ? `<img src="${thumb}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" loading="lazy"/>` : ''}
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(11,30,61,.4);">
          <div style="width:46px;height:46px;border-radius:50%;background:rgba(232,160,32,.9);display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#0B1E3D;"><i class="bi bi-play-fill"></i></div>
        </div>
        <span style="position:absolute;top:8px;right:8px;background:rgba(11,30,61,.8);color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.06em;padding:2px 8px;border-radius:4px;">${plat}</span>
        ${v.duration ? `<span style="position:absolute;bottom:8px;right:8px;background:rgba(11,30,61,.8);color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:.68rem;font-weight:700;padding:2px 8px;border-radius:4px;">${v.duration}</span>` : ''}
      </div>
      <div style="padding:12px 14px;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.95rem;color:#0B1E3D;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${v.title||'Untitled'}</div>
        <div style="font-size:.76rem;color:#8FA3BD;margin-bottom:10px;">${v.desc||''}</div>
        <div style="display:flex;gap:6px;">
          <button onclick="playPortalVideo('${v.url}','${(v.title||'').replace(/'/g,'\\'')}')">
            <i class="bi bi-play-circle"></i> Watch
          </button>
          <button onclick="${onDelete}('${v.id}')" style="background:rgba(214,59,59,.08);color:#D63B3B;border-color:rgba(214,59,59,.25);">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>`;
  }
  
  /* ── VIDEO LIGHTBOX ──────────────────────────────────────── */
  function playPortalVideo(url, title) {
    const embed = VID.embed(url);
    if (!embed) { showToast('Cannot play this video URL.', 'error'); return; }
    let lb = document.getElementById('portal-lightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'portal-lightbox';
      lb.style.cssText = 'position:fixed;inset:0;background:rgba(6,15,30,.92);backdrop-filter:blur(8px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:20px;';
      lb.innerHTML = `
        <div style="width:100%;max-width:900px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <span id="plb-title" style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1.1rem;color:#fff;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></span>
            <button onclick="closePortalVideo()" style="width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:.95rem;cursor:pointer;flex-shrink:0;margin-left:12px;"><i class="bi bi-x-lg"></i></button>
          </div>
          <div style="position:relative;padding-top:56.25%;background:#000;border-radius:12px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.6);">
            <iframe id="plb-iframe" style="position:absolute;inset:0;width:100%;height:100%;border:none;" allowfullscreen allow="autoplay;fullscreen"></iframe>
          </div>
        </div>`;
      lb.addEventListener('click', e => { if (e.target === lb) closePortalVideo(); });
      document.body.appendChild(lb);
    }
    document.getElementById('plb-title').textContent = title || '';
    document.getElementById('plb-iframe').src = embed;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  function closePortalVideo() {
    const lb = document.getElementById('portal-lightbox');
    if (lb) { lb.style.display = 'none'; document.getElementById('plb-iframe').src = ''; }
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePortalVideo(); });
  
  /* ── SHARED PORTAL CSS ───────────────────────────────────── */
  const PORTAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Barlow',sans-serif;color:#1C2B40;background:#F0F3F8;min-height:100vh;}
  
  /* LAYOUT */
  .portal-wrap{display:grid;grid-template-columns:240px 1fr;min-height:calc(100vh - 58px);}
  .portal-side{background:#FFFFFF;border-right:1px solid #DDE4EF;padding:20px 0;display:flex;flex-direction:column;}
  .portal-main{padding:32px 28px 60px;}
  .ps-section{display:none;}
  .ps-section.active{display:block;}
  
  /* SIDEBAR NAV */
  .ps-nav-label{padding:10px 20px 4px;font-family:'Barlow Condensed',sans-serif;font-size:.64rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#8FA3BD;}
  .ps-nav-item{display:flex;align-items:center;gap:10px;padding:10px 20px;font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:.88rem;letter-spacing:.05em;color:#5E7490;cursor:pointer;transition:all .2s;border-left:3px solid transparent;}
  .ps-nav-item:hover{color:#0B1E3D;background:#F4F7FB;}
  .ps-nav-item.active{color:#0B1E3D;background:#F4F7FB;border-left-color:#E8A020;font-weight:700;}
  .ps-nav-item i{font-size:.95rem;width:18px;text-align:center;}
  
  /* PAGE HEADER */
  .ps-page-head{margin-bottom:24px;}
  .ps-page-head h2{font-family:'Bebas Neue',cursive;font-size:1.8rem;letter-spacing:.04em;color:#0B1E3D;margin-bottom:4px;}
  .ps-page-head p{font-size:.88rem;color:#5E7490;line-height:1.6;}
  
  /* STATS */
  .ps-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px;}
  .ps-stat{background:#FFFFFF;border-radius:10px;border:1px solid #DDE4EF;padding:18px;display:flex;align-items:center;gap:14px;}
  .ps-stat-icon{width:44px;height:44px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
  .ps-stat-num{font-family:'Bebas Neue',cursive;font-size:1.9rem;color:#0B1E3D;letter-spacing:.04em;line-height:1;}
  .ps-stat-label{font-family:'Barlow Condensed',sans-serif;font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#5E7490;}
  
  /* CARDS */
  .ps-card{background:#FFFFFF;border-radius:12px;border:1px solid #DDE4EF;overflow:hidden;margin-bottom:22px;}
  .ps-card-head{padding:15px 20px;border-bottom:1px solid #DDE4EF;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
  .ps-card-head h3{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.85rem;letter-spacing:.1em;text-transform:uppercase;color:#0B1E3D;display:flex;align-items:center;gap:7px;}
  .ps-card-head h3 i{color:#E8A020;}
  .ps-card-body{padding:20px;}
  
  /* FORM */
  .ps-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .fg{display:flex;flex-direction:column;gap:5px;margin-bottom:14px;}
  .fg label{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#5E7490;}
  .fg label .req{color:#D63B3B;}
  .fg input,.fg select,.fg textarea{width:100%;padding:10px 14px;border:1.5px solid #DDE4EF;border-radius:8px;font-family:'Barlow',sans-serif;font-size:.9rem;color:#1C2B40;background:#FFFFFF;outline:none;transition:border-color .2s,box-shadow .2s;}
  .fg input:focus,.fg select:focus,.fg textarea:focus{border-color:#1A4B8C;box-shadow:0 0 0 3px rgba(26,75,140,.08);}
  .fg input.err,.fg select.err{border-color:#D63B3B;}
  .fg textarea{resize:vertical;min-height:80px;}
  
  /* TABLE */
  .ps-table-wrap{overflow-x:auto;}
  .ps-table{width:100%;border-collapse:collapse;}
  .ps-table thead tr{background:#F4F7FB;}
  .ps-table th{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#5E7490;padding:10px 14px;text-align:left;white-space:nowrap;}
  .ps-table td{padding:12px 14px;font-size:.86rem;color:#1C2B40;border-bottom:1px solid #EEF2F8;vertical-align:middle;}
  .ps-table tr:last-child td{border-bottom:none;}
  .ps-table tr:hover td{background:#FAFBFD;}
  .empty-row td{text-align:center;color:#8FA3BD;padding:40px;}
  
  /* BUTTONS */
  .btn-ps{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;padding:8px 16px;border-radius:7px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .2s;border:none;}
  .btn-ps-gold{background:#E8A020;color:#0B1E3D;}
  .btn-ps-gold:hover{background:#F5C05A;}
  .btn-ps-navy{background:#0B1E3D;color:#fff;}
  .btn-ps-navy:hover{background:#1A4B8C;}
  .btn-ps-ghost{background:transparent;color:#5E7490;border:1.5px solid #DDE4EF;}
  .btn-ps-ghost:hover{border-color:#0B1E3D;color:#0B1E3D;}
  .btn-ps-danger{background:rgba(214,59,59,.08);color:#D63B3B;border:1.5px solid rgba(214,59,59,.2);}
  .btn-ps-danger:hover{background:#D63B3B;color:#fff;border-color:#D63B3B;}
  
  /* BADGE */
  .ps-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-family:'Barlow Condensed',sans-serif;font-size:.68rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;}
  .badge-active{background:rgba(26,122,58,.1);color:#1A7A3A;}
  .badge-draft{background:rgba(232,160,32,.12);color:#8A5A00;}
  .badge-low{background:rgba(214,59,59,.1);color:#D63B3B;}
  
  /* VIDEO GRID */
  .vid-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;}
  .vid-grid button{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;padding:6px 10px;border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .2s;border:1.5px solid #DDE4EF;background:#FFFFFF;color:#5E7490;}
  .vid-grid button:hover{border-color:#0B1E3D;color:#0B1E3D;}
  
  /* VIDEO URL PREVIEW */
  .vid-url-preview{display:none;background:#F4F7FB;border:1px solid #DDE4EF;border-radius:8px;padding:10px 14px;margin-top:6px;font-size:.82rem;color:#5E7490;align-items:center;gap:10px;}
  .vid-url-preview.show{display:flex;}
  .vid-url-preview img{width:80px;height:50px;object-fit:cover;border-radius:5px;flex-shrink:0;}
  
  /* MODAL */
  .ps-modal-overlay{display:none;position:fixed;inset:0;background:rgba(11,30,61,.55);backdrop-filter:blur(6px);z-index:900;align-items:center;justify-content:center;padding:20px;overflow-y:auto;}
  .ps-modal-overlay.open{display:flex;}
  .ps-modal{background:#FFFFFF;border-radius:14px;width:100%;max-width:560px;overflow:hidden;box-shadow:0 24px 64px rgba(11,30,61,.2);animation:psModalIn .25s ease;margin:auto;}
  @keyframes psModalIn{from{opacity:0;transform:translateY(14px) scale(.97);}to{opacity:1;transform:none;}}
  .ps-modal-head{background:linear-gradient(135deg,#0B1E3D 0%,#1A4B8C 100%);padding:16px 22px;display:flex;align-items:center;justify-content:space-between;}
  .ps-modal-head h3{font-family:'Bebas Neue',cursive;font-size:1.2rem;letter-spacing:.08em;color:#fff;display:flex;align-items:center;gap:8px;}
  .ps-modal-head h3 i{color:#E8A020;}
  .ps-modal-close{background:none;border:none;color:rgba(255,255,255,.6);font-size:1.1rem;cursor:pointer;transition:color .2s;}
  .ps-modal-close:hover{color:#fff;}
  .ps-modal-body{padding:22px;max-height:70vh;overflow-y:auto;}
  .ps-modal-foot{padding:14px 22px;background:#F4F7FB;border-top:1px solid #DDE4EF;display:flex;gap:10px;justify-content:flex-end;}
  
  /* RESPONSIVE */
  @media(max-width:900px){.portal-wrap{grid-template-columns:1fr;}.portal-side{display:none;}.ps-stats{grid-template-columns:1fr 1fr;}}
  @media(max-width:560px){.ps-stats{grid-template-columns:1fr;}.ps-form-grid{grid-template-columns:1fr;}}
  `;
  
  
  /* ════════════════════════════════════════════
     IMAGE UPLOADER COMPONENT
     - Drag & drop zone
     - Click to browse (file picker)
     - Paste from clipboard (Ctrl+V)
     - URL fallback tab
     - Stores as base64 dataURL in a hidden input
     Call: mountImgUploader(wrapperId, hiddenInputId)
  ════════════════════════════════════════════ */
  const IMG_UPLOADER_CSS = `
  .img-upload-wrap{border:2px dashed #DDE4EF;border-radius:10px;overflow:hidden;background:#FAFBFD;transition:all .25s;position:relative;}
  .img-upload-wrap.drag-over{border-color:#E8A020;background:rgba(232,160,32,.05);}
  .img-upload-wrap.has-img{border-style:solid;border-color:#DDE4EF;}
  .iuw-tabs{display:flex;border-bottom:1px solid #EEF2F8;background:#F4F7FB;}
  .iuw-tab{flex:1;padding:9px 12px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:#8FA3BD;cursor:pointer;border:none;background:transparent;transition:all .2s;border-bottom:2px solid transparent;}
  .iuw-tab.active{color:#0B1E3D;background:#fff;border-bottom-color:#E8A020;}
  .iuw-tab:hover:not(.active){color:#5E7490;}
  .iuw-panel{display:none;padding:0;}
  .iuw-panel.active{display:block;}
  .iuw-drop{padding:28px 20px;text-align:center;cursor:pointer;position:relative;}
  .iuw-drop input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;}
  .iuw-drop-icon{font-size:2.2rem;color:#DDE4EF;margin-bottom:10px;display:block;transition:color .2s;}
  .img-upload-wrap.drag-over .iuw-drop-icon{color:#E8A020;}
  .iuw-drop-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.92rem;color:#0B1E3D;margin-bottom:4px;}
  .iuw-drop-sub{font-size:.78rem;color:#8FA3BD;line-height:1.5;}
  .iuw-drop-sub strong{color:#1A4B8C;cursor:pointer;}
  .iuw-hint{font-size:.7rem;color:#8FA3BD;margin-top:8px;display:flex;align-items:center;justify-content:center;gap:12px;}
  .iuw-hint span{display:flex;align-items:center;gap:3px;}
  .iuw-url-panel{padding:14px;}
  .iuw-url-row{display:flex;gap:8px;}
  .iuw-url-input{flex:1;padding:9px 13px;border:1.5px solid #DDE4EF;border-radius:8px;font-family:'Barlow',sans-serif;font-size:.88rem;color:#1C2B40;outline:none;transition:border-color .2s;}
  .iuw-url-input:focus{border-color:#1A4B8C;}
  .iuw-url-btn{padding:9px 16px;background:#0B1E3D;color:#fff;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:background .2s;}
  .iuw-url-btn:hover{background:#1A4B8C;}
  .iuw-preview{position:relative;display:none;}
  .iuw-preview.show{display:block;}
  .iuw-preview img{width:100%;height:220px;object-fit:cover;display:block;}
  .iuw-preview-bar{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(11,30,61,.7));padding:10px 14px;display:flex;align-items:center;justify-content:space-between;}
  .iuw-preview-name{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.78rem;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;}
  .iuw-preview-remove{background:rgba(214,59,59,.8);color:#fff;border:none;border-radius:6px;padding:4px 10px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:background .2s;}
  .iuw-preview-remove:hover{background:#D63B3B;}
  .iuw-err{font-size:.76rem;color:#D63B3B;padding:8px 14px;display:none;}
  .iuw-err.show{display:block;}
  `;
  
  function mountImgUploader(wrapperId, hiddenInputId, opts) {
    opts = opts || {};
    const maxMB   = opts.maxMB   || 5;
    const accept  = opts.accept  || ['image/jpeg','image/png','image/webp','image/gif'];
    const label   = opts.label   || 'Upload Image';
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
  
    // Inject CSS once
    if (!document.getElementById('iuw-style')) {
      const s = document.createElement('style');
      s.id = 'iuw-style';
      s.textContent = IMG_UPLOADER_CSS;
      document.head.appendChild(s);
    }
  
    // Build HTML
    wrapper.innerHTML = `
      <div class="img-upload-wrap" id="${wrapperId}-box">
        <!-- Preview (shown after image selected) -->
        <div class="iuw-preview" id="${wrapperId}-preview">
          <img id="${wrapperId}-preview-img" src="" alt="Preview"/>
          <div class="iuw-preview-bar">
            <span class="iuw-preview-name" id="${wrapperId}-preview-name"></span>
            <button class="iuw-preview-remove" onclick="iuwClear('${wrapperId}','${hiddenInputId}')">✕ Remove</button>
          </div>
        </div>
        <!-- Tabs -->
        <div class="iuw-tabs" id="${wrapperId}-tabs">
          <button class="iuw-tab active" onclick="iuwTab('${wrapperId}','upload')"><i class="bi bi-upload"></i> Upload File</button>
          <button class="iuw-tab" onclick="iuwTab('${wrapperId}','url')"><i class="bi bi-link-45deg"></i> Use URL</button>
        </div>
        <!-- Upload panel -->
        <div class="iuw-panel active" id="${wrapperId}-panel-upload">
          <div class="iuw-drop" id="${wrapperId}-drop">
            <input type="file" accept="${accept.join(',')}" onchange="iuwFile(event,'${wrapperId}','${hiddenInputId}')"/>
            <i class="bi bi-cloud-arrow-up iuw-drop-icon"></i>
            <div class="iuw-drop-title">Drag & drop your image here</div>
            <div class="iuw-drop-sub">or <strong>click to browse</strong> your files</div>
            <div class="iuw-hint">
              <span><i class="bi bi-file-earmark-image"></i> JPG, PNG, WEBP</span>
              <span><i class="bi bi-hdd"></i> Max ${maxMB}MB</span>
              <span><i class="bi bi-clipboard"></i> Paste (Ctrl+V)</span>
            </div>
          </div>
        </div>
        <!-- URL panel -->
        <div class="iuw-panel" id="${wrapperId}-panel-url">
          <div class="iuw-url-panel">
            <label style="font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:#5E7490;display:block;margin-bottom:8px;">Image URL</label>
            <div class="iuw-url-row">
              <input class="iuw-url-input" id="${wrapperId}-url-inp" placeholder="https://example.com/car.jpg" type="url"/>
              <button class="iuw-url-btn" onclick="iuwFromUrl('${wrapperId}','${hiddenInputId}')"><i class="bi bi-check-lg"></i> Use</button>
            </div>
            <div style="font-size:.72rem;color:#8FA3BD;margin-top:8px;">Paste any direct image link from the web</div>
          </div>
        </div>
        <div class="iuw-err" id="${wrapperId}-err"></div>
      </div>`;
  
    // Drag & drop events
    const box  = document.getElementById(wrapperId + '-box');
    const drop = document.getElementById(wrapperId + '-drop');
    box.addEventListener('dragover',  e => { e.preventDefault(); box.classList.add('drag-over'); });
    box.addEventListener('dragleave', e => { box.classList.remove('drag-over'); });
    box.addEventListener('drop',      e => {
      e.preventDefault(); box.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) iuwProcessFile(file, wrapperId, hiddenInputId, accept, maxMB);
    });
  
    // Paste support (clipboard image)
    document.addEventListener('paste', e => {
      // Only handle paste when this uploader is "active" (no preview yet)
      const preview = document.getElementById(wrapperId + '-preview');
      if (preview && preview.classList.contains('show')) return;
      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          iuwProcessFile(file, wrapperId, hiddenInputId, accept, maxMB);
          break;
        }
      }
    });
  }
  
  function iuwTab(wrapperId, tab) {
    ['upload','url'].forEach(t => {
      document.getElementById(wrapperId + '-panel-' + t)?.classList.toggle('active', t === tab);
      const tabs = document.querySelectorAll(`#${wrapperId}-box .iuw-tab`);
      if (tabs[0]) tabs[0].classList.toggle('active', t === 'upload' && tab === 'upload');
      if (tabs[1]) tabs[1].classList.toggle('active', t === 'url'    && tab === 'url');
    });
  }
  
  function iuwFile(event, wrapperId, hiddenInputId) {
    const file = event.target.files[0];
    if (!file) return;
    iuwProcessFile(file, wrapperId, hiddenInputId, null, 5);
  }
  
  function iuwProcessFile(file, wrapperId, hiddenInputId, accept, maxMB) {
    const errEl = document.getElementById(wrapperId + '-err');
    if (!file.type.startsWith('image/')) {
      iuwShowErr(wrapperId, 'Only image files are accepted (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      iuwShowErr(wrapperId, `File too large. Maximum size is ${maxMB}MB.`);
      return;
    }
    errEl.classList.remove('show');
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      document.getElementById(hiddenInputId).value = dataUrl;
      iuwShowPreview(wrapperId, dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  }
  
  function iuwFromUrl(wrapperId, hiddenInputId) {
    const url = document.getElementById(wrapperId + '-url-inp').value.trim();
    if (!url) { iuwShowErr(wrapperId, 'Please enter an image URL.'); return; }
    // Test the URL loads as an image
    const img = new Image();
    img.onload  = () => {
      document.getElementById(hiddenInputId).value = url;
      iuwShowPreview(wrapperId, url, url.split('/').pop().split('?')[0] || 'image');
    };
    img.onerror = () => iuwShowErr(wrapperId, 'Could not load image from this URL. Check the link and try again.');
    img.src = url;
  }
  
  function iuwShowPreview(wrapperId, src, name) {
    const preview = document.getElementById(wrapperId + '-preview');
    const tabs    = document.getElementById(wrapperId + '-tabs');
    document.getElementById(wrapperId + '-preview-img').src  = src;
    document.getElementById(wrapperId + '-preview-name').textContent = name || 'Image';
    preview.classList.add('show');
    // Hide tabs and panels while preview is shown
    if (tabs) tabs.style.display = 'none';
    ['upload','url'].forEach(t => document.getElementById(wrapperId + '-panel-' + t)?.classList.remove('active'));
    document.getElementById(wrapperId + '-box')?.classList.add('has-img');
  }
  
  function iuwClear(wrapperId, hiddenInputId) {
    document.getElementById(hiddenInputId).value = '';
    document.getElementById(wrapperId + '-preview').classList.remove('show');
    document.getElementById(wrapperId + '-preview-img').src = '';
    const tabs = document.getElementById(wrapperId + '-tabs');
    if (tabs) tabs.style.display = 'flex';
    document.getElementById(wrapperId + '-panel-upload').classList.add('active');
    document.getElementById(wrapperId + '-box')?.classList.remove('has-img');
    iuwTab(wrapperId, 'upload');
    // Reset file input
    const fileInput = document.querySelector(`#${wrapperId}-drop input[type=file]`);
    if (fileInput) fileInput.value = '';
  }
  
  function iuwShowErr(wrapperId, msg) {
    const el = document.getElementById(wrapperId + '-err');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 4000);
  }
  
  /* Helper: get image value (dataURL or URL) from hidden input */
  function iuwGetValue(hiddenInputId) {
    return document.getElementById(hiddenInputId)?.value || '';
  }