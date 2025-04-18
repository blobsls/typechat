// dir.js
class D {
  constructor() {
    this.e = new Map();  // elements storage
    this.p = new Map();  // parent relationships
    this.c = new Map();  // children relationships
  }

  // Add element to directory
  a(id, el, pid = null) {
    this.e.set(id, el);
    if (pid) {
      this.p.set(id, pid);
      if (!this.c.has(pid)) this.c.set(pid, []);
      this.c.get(pid).push(id);
    }
    return this;
  }

  // Get element by ID
  g(id) {
    return this.e.get(id);
  }

  // Get parent ID
  p(id) {
    return this.p.get(id);
  }

  // Get children IDs
  c(id) {
    return this.c.get(id) || [];
  }

  // Move element to new parent
  m(id, newPid) {
    const oldPid = this.p.get(id);
    if (oldPid) {
      const siblings = this.c.get(oldPid);
      if (siblings) {
        this.c.set(oldPid, siblings.filter(s => s !== id));
      }
    }
    this.p.set(id, newPid);
    if (!this.c.has(newPid)) this.c.set(newPid, []);
    this.c.get(newPid).push(id);
    return this;
  }

  // Remove element
  r(id) {
    if (!this.e.has(id)) return false;
    
    // Remove all children recursively
    this.c(id).forEach(childId => this.r(childId));
    
    // Remove from parent's children
    const pid = this.p(id);
    if (pid) {
      const siblings = this.c.get(pid);
      if (siblings) {
        this.c.set(pid, siblings.filter(s => s !== id));
      }
    }
    
    // Clean up maps
    this.e.delete(id);
    this.p.delete(id);
    this.c.delete(id);
    
    return true;
  }

  // Get full path
  path(id) {
    const path = [];
    let current = id;
    while (current) {
      path.unshift(current);
      current = this.p.get(current);
    }
    return path;
  }
}
