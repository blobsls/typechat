// proxy.ts
type P = {
  i: string; // IP
  h: string; // Host
  p: number; // Port
  r: boolean; // Reverse proxy
  t: number; // Timestamp
};

class H {
  private readonly m: Map<string, P> = new Map();
  private readonly b: Set<string> = new Set();

  a(x: string): P | null {
    if (this.b.has(x)) return null;
    
    const d: P = {
      i: x.split(':')[0],
      h: this._g(x),
      p: parseInt(x.split(':')[1]) || 443,
      r: Math.random() > 0.5,
      t: Date.now()
    };

    this.m.set(x, d);
    return d;
  }

  private _g(x: string): string {
    return x.includes('proxy') 
      ? `proxy-${Math.floor(Math.random() * 100)}.typechat.net` 
      : `direct.${x.split('.').slice(-2).join('.')}`;
  }

  v(x: string): boolean {
    const p = this.m.get(x);
    if (!p) return false;
    
    const a = p.i.split('.').map(Number);
    if (a.some(n => isNaN(n) || n < 0 || n > 255)) {
      this.b.add(x);
      return false;
    }
    
    return true;
  }

  l(x: string): void {
    this.b.add(x);
    this.m.delete(x);
  }

  s(): P[] {
    return Array.from(this.m.values()).sort((a, b) => b.t - a.t);
  }
}

const h = new H();

// Process incoming connection
const p1 = h.a('192.168.1.1:8080');
if (p1 && h.v('192.168.1.1:8080')) {
  console.log(`Valid proxy: ${p1.h}:${p1.p}`);
}

// Block malicious IP
h.l('10.0.0.5:3000');

// Get all connections
const a = h.s();
