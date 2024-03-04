import { Injectable } from "@nestjs/common";
import { JwtPayload } from "@app/common/entities/jwt-payload";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokenRepository } from "@app/auth/repositories/token.repository";
import { Role } from "@app/common/enums/role";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenRepository: TokenRepository
  ) {}

  async getAccessToken(userId: string, tokenId: string): Promise<string> {
    const key = `${userId}.${tokenId}.at`;
    return this.tokenRepository.getToken(key);
  }

  async getRefreshToken(userId: string, tokenId: string): Promise<string> {
    const key = `${userId}.${tokenId}.rt`;
    return this.tokenRepository.getToken(key);
  }

  async saveAccessToken(
    userId: string,
    tokenId: string,
    token: string
  ): Promise<boolean> {
    const key = `${userId}.${tokenId}.at`;
    const exp = 15 * 60;
    return await this.tokenRepository.saveToken(key, token, exp);
  }

  async saveRefreshToken(
    userId: string,
    tokenId: string,
    token: string
  ): Promise<boolean> {
    const key = `${userId}.${tokenId}.rt`;
    const exp = 7 * 24 * 60 * 60;
    return await this.tokenRepository.saveToken(key, token, exp);
  }

  async deleteAccessTokens(userId: string, tokenId: string): Promise<boolean> {
    const key = `${userId}.${tokenId}.at`;
    return await this.tokenRepository.deleteToken(key);
  }

  async deleteRefreshTokens(userId: string, tokenId: string): Promise<boolean> {
    const key = `${userId}.${tokenId}.rt`;
    return await this.tokenRepository.deleteToken(key);
  }

  async generateAccessToken(
    userId: string,
    tokenId: string,
    roles: Role[]
  ): Promise<string> {
    const secret = this.configService.get<string>("AT_SECRET");
    const payload: JwtPayload = {
      iss: "nestjsblog",
      sub: userId,
      tokenId,
      roles,
    };

    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: "15m",
    });
  }

  async generateRefreshToken(
    userId: string,
    tokenId: string,
    roles: Role[]
  ): Promise<string> {
    const secret = this.configService.get<string>("RT_SECRET");
    const payload: JwtPayload = {
      iss: "nestjsblog",
      sub: userId,
      tokenId,
      roles,
    };

    return await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: "7d",
    });
  }
}
