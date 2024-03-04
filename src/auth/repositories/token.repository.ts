import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";

@Injectable()
export class TokenRepository {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getToken(key: string): Promise<string> {
    return await this.cacheManager.get<string>(key);
  }

  async saveToken(key: string, token: string, ttl: number): Promise<boolean> {
    await this.cacheManager.set(key, token, { ttl });
    return true;
  }

  async deleteToken(key: string): Promise<boolean> {
    await this.cacheManager.del(key);
    return true;
  }
}
