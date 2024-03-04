import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./services/auth.service";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { AuthController } from "./controllers/auth.controller";
import { TokenService } from "@app/auth/services/token.service";
import { TokenRepository } from "@app/auth/repositories/token.repository";
import { NestjsFormDataModule } from "nestjs-form-data";

@Module({
  imports: [
    JwtModule.register({
      secret: "at-secret",
      signOptions: { expiresIn: "15m" },
    }),
    NestjsFormDataModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    TokenRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
