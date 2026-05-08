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

export default VID;
