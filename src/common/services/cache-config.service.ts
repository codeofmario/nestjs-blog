import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ClientOpts } from "redis";
import * as redisStore from "cache-manager-redis-store";

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions<ClientOpts> {
    return {
      isGlobal: true,
      store: redisStore,
      host: this.configService.get("REDIS_HOST"),
      port: this.configService.get("REDIS_PORT"),
    };
  }
}
