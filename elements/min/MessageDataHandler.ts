// MessageDataHandler.ts
type M = {
  i: string;          // message ID
  t: number;          // timestamp
  u: string;          // user ID
  c: string;          // content
  s: 's'|'d'|'r'|'f'; // status: sent/delivered/read/failed
  m?: unknown;        // metadata
};

class H {
  private readonly d: Map<string, M> = new Map();
  private readonly l: M[] = [];
  private readonly u: Set<string> = new Set();

  a(m: Omit<M, 'i'|'t'|'s'>): M {
    const n: M = {
      ...m,
      i: crypto.randomUUID(),
      t: Date.now(),
      s: 's'
    };
    this.d.set(n.i, n);
    this.l.unshift(n);
    return n;
  }

  g(id: string): M | undefined {
    return this.d.get(id);
  }

  u(id: string, s: M['s']): boolean {
    const m = this.d.get(id);
    if (!m) return false;
    m.s = s;
    if (s === 'r') this.u.add(m.u);
    return true;
  }

  f(u?: string): M[] {
    return u 
      ? this.l.filter(m => m.u === u) 
      : [...this.l];
  }

  x(id: string): boolean {
    const m = this.g(id);
    if (!m) return false;
    m.s = 'f';
    return this.d.delete(id);
  }
}
