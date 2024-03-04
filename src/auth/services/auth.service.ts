import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

import { RegisterRequestDto } from "@app/common/dtos/request/register-request.dto";
import { TokensResponseDto } from "@app/common/dtos/response/tokens.response.dto";
import { LoginRequestDto } from "@app/common/dtos/request/login-request.dto";
import { TokenService } from "@app/auth/services/token.service";
import { Role as RoleEnum } from "@app/common/enums/role";
import { UserInfoResponseDto } from "@app/common/dtos/response/user-info-response.dto";
import { MinioService } from "nestjs-minio-client";
import { DataSource } from "typeorm";
import { User } from "@app/common/entities/user.entity";
import { RoleService } from "@app/common/services/role.service";
import { UserService } from "@app/common/services/user.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject("DATA_SOURCE") private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenService: TokenService,
    private minioService: MinioService,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  async register(dto: RegisterRequestDto): Promise<TokensResponseDto> {
    const avatarId = uuid();
    const { avatar } = dto;
    await this.minioService.client.putObject(
      "nestjsblog",
      avatarId,
      avatar.buffer,
      avatar.size,
      { "Content-Type": avatar.mimeType }
    );

    const password = await bcrypt.hash(dto.password, 10);
    const role = await this.roleService.findOneByName(RoleEnum.USER);

    let user = new User();
    user.username = dto.username;
    user.email = dto.email;
    user.password = password;
    user.avatarUrl = `/assets/images/${avatarId}`;
    user.roles = [role];

    user = await this.userService.create(user);

    return this.getTokens(
      user.id,
      user.roles.map((role) => role.name as RoleEnum)
    );
  }

  async login(dto: LoginRequestDto): Promise<TokensResponseDto> {
    const user = await this.userService.findOneByUsername(dto.username);

    if (!user) throw new ForbiddenException("Access Denied");

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException("Access Denied");

    return this.getTokens(
      user.id,
      user.roles.map((role) => role.name as RoleEnum)
    );
  }

  async logout(userId: string, tokenId: string): Promise<boolean> {
    await this.deleteTokens(userId, tokenId);
    return true;
  }

  async refreshTokens(
    userId: string,
    tokenId: string
  ): Promise<TokensResponseDto> {
    const user = await this.userService.findOne(userId);
    const refreshToken = this.tokenService.getRefreshToken(userId, tokenId);
    if (!user || !refreshToken) throw new ForbiddenException("Access Denied");

    await this.deleteTokens(userId, tokenId);
    return await this.getTokens(
      user.id,
      user.roles.map((role) => role.name as RoleEnum)
    );
  }

  async me(userId: string): Promise<UserInfoResponseDto> {
    const user = await this.userService.findOne(userId);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatarUrl,
    };
  }

  private async getTokens(
    userId: string,
    roles: RoleEnum[]
  ): Promise<TokensResponseDto> {
    const tokenId = uuid();
    const tokens = await this.generateTokens(userId, tokenId, roles);
    await this.saveTokens(userId, tokenId, tokens);
    return tokens;
  }

  private async generateTokens(
    userId: string,
    tokenId: string,
    roles: RoleEnum[]
  ): Promise<TokensResponseDto> {
    const accessToken = await this.tokenService.generateAccessToken(
      userId,
      tokenId,
      roles
    );
    const refreshToken = await this.tokenService.generateRefreshToken(
      userId,
      tokenId,
      roles
    );
    return { accessToken, refreshToken };
  }

  private async saveTokens(
    userId: string,
    tokenId: string,
    tokens: TokensResponseDto
  ): Promise<void> {
    await this.tokenService.saveAccessToken(
      userId,
      tokenId,
      tokens.accessToken
    );
    await this.tokenService.saveRefreshToken(
      userId,
      tokenId,
      tokens.refreshToken
    );
  }

  private async deleteTokens(userId: string, tokenId: string): Promise<void> {
    await this.tokenService.deleteAccessTokens(userId, tokenId);
    await this.tokenService.deleteRefreshTokens(userId, tokenId);
  }
}
