// html.js
class U {
  constructor() {
    this.o = new Map(); // embedded iframes
    this.s = new Set(); // allowed domains
  }

  // Configure allowed domains
  a(...domains) {
    domains.forEach(d => this.s.add(d));
    return this;
  }

  // Create universal embed iframe
  c(url) {
    try {
      const u = new URL(url);
      if (!this.s.has(u.hostname)) return null;

      const i = document.createElement('iframe');
      i.src = url;
      i.loading = 'lazy';
      i.allowFullscreen = true;
      i.referrerPolicy = 'no-referrer-when-downgrade';
      i.style.border = 'none';
      i.style.width = '100%';
      i.style.minHeight = '300px';

      this.o.set(url, i);
      return i;
    } catch {
      return null;
    }
  }

  // Handle text content and return embeds
  h(text) {
    const urls = text.match(/(https?:\/\/[^\s]+)/g) || [];
    return urls
      .map(url => this.o.get(url) || this.c(url))
      .filter(Boolean);
  }

  // Clear all embeds
  x() {
    this.o.clear();
  }
}
