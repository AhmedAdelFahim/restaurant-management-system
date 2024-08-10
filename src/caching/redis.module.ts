import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

const providers = [
  {
    inject: [ConfigService],
    provide: 'RedisConnection',
    useFactory: async (configService: ConfigService) => {
      try {
        const client: Redis = new Redis(
          configService.get<string>('caching.redisURL'),
        );
        client.on('ready', () => {
          Logger.verbose('Redis is ready');
        });
        client.on('error', (e) => {
          Logger.verbose(`Redis error: ${e}`);
        });
        return client;
      } catch (error) {
        throw new Error('Redis not connected');
      }
    },
  },
];

@Global()
@Module({
  providers: [...providers, RedisService],
  exports: [...providers, RedisService],
})
export class RedisModule {}
