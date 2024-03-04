import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AccessTokenGuard } from "./common/guards/access-token.guard";
import { AuthModule } from "./auth/auth.module";
import { CommonModule } from "./common/common.module";
import { FileProxyController } from "@app/file-proxy.controller";
import { BlogModule } from "@app/blog/blog.module";
import { RolesGuard } from "@app/common/guards/roles.guard";

@Module({
  imports: [CommonModule, AuthModule, BlogModule],
  controllers: [FileProxyController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
