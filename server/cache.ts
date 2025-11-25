export class CacheManager {
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  set(key: string, data: any, ttl: number = 300000) {
    // Default 5 minutes
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(pattern: string) {
    const keysToDelete: string[] = [];
    Array.from(this.cache.keys()).forEach((key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  clear() {
    this.cache.clear();
  }

  // Cleanup expired items periodically
  startCleanup(interval: number = 60000) {
    setInterval(() => {
      const now = Date.now();
      const expiredKeys: string[] = [];

      Array.from(this.cache.entries()).forEach(([key, value]) => {
        if (now > value.expiry) {
          expiredKeys.push(key);
        }
      });

      expiredKeys.forEach((key) => this.cache.delete(key));
    }, interval);
  }
}

export const cacheManager = new CacheManager();
