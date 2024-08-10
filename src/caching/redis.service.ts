import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('RedisConnection') private clientRedis: Redis) {}

  async setKey(key: string, value: string, options: { ttl?: number } = {}) {
    await this.clientRedis.set(key, value);
    if (options.ttl) {
      await this.clientRedis.expire(key, options.ttl);
    }
  }

  async getKey(key) {
    return this.clientRedis.get(key);
  }
}
