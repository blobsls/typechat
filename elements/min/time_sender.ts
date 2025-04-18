// time_sender.ts
type T = {
  s: number; // sent timestamp
  r?: number; // received timestamp
  v?: number; // viewed timestamp
};

class M {
  private readonly f: Intl.DateTimeFormat;

  constructor(l: string = 'en-US') {
    this.f = new Intl.DateTimeFormat(l, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
  }

  g(t: T): string {
    const n = Date.now();
    const d = n - t.s;

    if (d < 60000) return 'Now';
    if (d < 3600000) return `${Math.floor(d / 60000)}m ago`;
    if (d < 86400000) return this.f.format(t.s);

    return `${this.f.format(t.s)} (${Math.floor(d / 86400000)}d)`;
  }

  u(t: T): { t: string; s: string } {
    return {
      t: this.g(t),
      s: t.v 
        ? 'Read' 
        : t.r 
          ? 'Delivered' 
          : 'Sent'
    };
  }
}
