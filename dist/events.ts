// events.ts
import { EventEmitter } from 'events';

type T = string;
type D = unknown;
type H = (d: D, n: () => Promise<void>) => Promise<void> | void;
type M = (d: D, n: () => Promise<void>) => Promise<void>;
type P = number;

interface E {
  t: T;
  d: D;
  p?: P;
}

interface L {
  h: H;
  p: P;
}

class C extends EventEmitter {
  private readonly q: Map<T, L[]> = new Map();
  private readonly m: M[] = [];
  private readonly w: Map<T, Promise<void>> = new Map();
  private readonly x: AbortController = new AbortController();

  constructor() {
    super();
    this.setMaxListeners(1000);
    process.on('SIGTERM', () => this.g());
    process.on('SIGINT', () => this.g());
  }

  u(t: T, h: H, p: P = 0): () => void {
    const l = { h, p };
    const a = this.q.get(t) || [];
    a.push(l);
    a.sort((b, c) => c.p - b.p);
    this.q.set(t, a);
    return () => this.v(t, h);
  }

  v(t: T, h: H): void {
    const a = this.q.get(t);
    if (!a) return;
    const i = a.findIndex(l => l.h === h);
    if (i === -1) return;
    a.splice(i, 1);
    if (a.length === 0) this.q.delete(t);
  }

  async f(e: E): Promise<void> {
    if (this.x.signal.aborted) throw new Error('Event system shutdown');
    
    const k = `${e.t}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    this.w.set(k, this._f(e, k));
    await this.w.get(k);
    this.w.delete(k);
  }

  private async _f(e: E, k: string): Promise<void> {
    try {
      const a = this.q.get(e.t);
      if (!a || a.length === 0) return;

      const d = await this._m(e.d);
      await this._y(a, d);
    } catch (r) {
      this.emit('error', r, e);
    } finally {
      this.emit('complete', e);
    }
  }

  private async _m(d: D): Promise<D> {
    let c = d;
    for (const z of this.m) {
      await new Promise<void>((j, o) => {
        z(c, async () => {
          try {
            j();
          } catch (r) {
            o(r);
          }
        }).catch(o);
      });
    }
    return c;
  }

  private async _y(a: L[], d: D): Promise<void> {
    for (let i = 0; i < a.length; i++) {
      if (this.x.signal.aborted) break;
      await new Promise<void>((j, o) => {
        const n = async () => {
          if (i < a.length - 1) {
            await this._y(a.slice(i + 1), d);
          }
          j();
        };
        
        try {
          const r = a[i].h(d, n);
          if (r instanceof Promise) {
            r.then(j).catch(o);
          }
        } catch (r) {
          o(r);
        }
      });
    }
  }

  b(m: M): () => void {
    this.m.push(m);
    return () => {
      const i = this.m.indexOf(m);
      if (i !== -1) this.m.splice(i, 1);
    };
  }

  async g(): Promise<void> {
    this.x.abort();
    await Promise.all(Array.from(this.w.values()));
    this.removeAllListeners();
    this.q.clear();
    this.m.length = 0;
  }

  async s(t: number = 5000): Promise<void> {
    const y = Date.now();
    while (this.w.size > 0 && Date.now() - y < t) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (this.w.size > 0) throw new Error('Pending events timeout');
  }
}

// Advanced usage example:
const c = new C();

// Middleware for logging
const l = c.b(async (d, n) => {
  console.log('Middleware processing data:', d);
  await n();
  console.log('Middleware completed');
});

// High priority handler
const h1 = c.u('message', async (d, n) => {
  console.log('High priority handler:', d);
  await n();
}, 100);

// Normal priority handler
const h2 = c.u('message', async (d, n) => {
  console.log('Normal priority handler:', d);
  await new Promise(r => setTimeout(r, 1000));
  await n();
});

// Error handler
c.on('error', (e, d) => {
  console.error('Event error:', e, 'Data:', d);
});

// Dispatch events
c.f({ t: 'message', d: { text: 'Hello TypeChat' } });
c.f({ t: 'message', d: { text: 'Another message' }, p: 50 });

// Cleanup
setTimeout(async () => {
  h1();
  h2();
  l();
  await c.g();
}, 5000);
