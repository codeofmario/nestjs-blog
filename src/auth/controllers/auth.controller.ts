import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "../services/auth.service";
import { NoAuth } from "@app/common/decorators/public.decorator";
import { CurrentUserId } from "@app/common/decorators/current-user-id.decorator";
import { RefreshTokenGuard } from "@app/common/guards/refresh-token.guard";
import { LoginRequestDto } from "@app/common/dtos/request/login-request.dto";
import { TokensResponseDto } from "@app/common/dtos/response/tokens.response.dto";
import { RestResponse } from "@app/common/interfaces/rest-response";
import { ok } from "@app/common/utils/response.util";
import { CurrentUserTokenId } from "@app/common/decorators/current-user-token-id.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserInfoResponseDto } from "@app/common/dtos/response/user-info-response.dto";

@Controller("api/v1/auth")
@ApiBearerAuth()
@ApiTags("Auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @NoAuth()
  @Post("signin")
  async login(
    @Body() dto: LoginRequestDto
  ): Promise<RestResponse<TokensResponseDto>> {
    const data = await this.authService.login(dto);
    return ok(data);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUserId() userId: string,
    @CurrentUserTokenId() tokenId: string
  ): Promise<void> {
    await this.authService.logout(userId, tokenId);
  }

  @NoAuth()
  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  async refreshTokens(
    @CurrentUserId() userId: string,
    @CurrentUserTokenId() tokenId: string
  ): Promise<RestResponse<TokensResponseDto>> {
    const data = await this.authService.refreshTokens(userId, tokenId);
    return ok(data);
  }

  @Get("me")
  async me(
    @CurrentUserId() userId: string
  ): Promise<RestResponse<UserInfoResponseDto>> {
    const data = await this.authService.me(userId);
    return ok(data);
  }
}
