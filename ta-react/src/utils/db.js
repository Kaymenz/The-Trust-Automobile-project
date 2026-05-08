const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  add(key, item) { const a = this.get(key); a.unshift(item); this.set(key, a); },
  del(key, id) { this.set(key, this.get(key).filter(x => x.id !== id)); },
  upd(key, item) { this.set(key, this.get(key).map(x => x.id === item.id ? { ...x, ...item } : x)); },
  find(key, id) { return this.get(key).find(x => x.id === id); },
  uid() { return Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,5).toUpperCase(); },
};

export default DB;
