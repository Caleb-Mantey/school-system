import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setCache(key: string, value: any, expiration = 1000) {
    await this.cacheManager.set(key, value, { ttl: expiration });
  }

  async setCacheNoExpiry(key: string, value: any) {
    await this.cacheManager.set(key, value, { ttl: 0 });
  }

  async getCache(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async deleteCache(key: string) {
    await this.cacheManager.del(key);
  }

  async resetCache() {
    await this.cacheManager.reset();
  }
}
