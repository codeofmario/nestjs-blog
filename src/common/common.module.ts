import { CacheModule, Global, Module } from "@nestjs/common";
import { CacheConfigService } from "./services/cache-config.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MinioModule } from "nestjs-minio-client";
import { MinioConfigService } from "./services/minio-config.service";
import { CommentService } from "@app/common/services/comment.service";
import { CommentRepository } from "@app/common/repositories/comment.repository";
import { StoreService } from "@app/common/services/store.service";
import { PostRepository } from "@app/common/repositories/post.repository";
import { PostService } from "@app/common/services/post.service";
import { RoleRepository } from "@app/common/repositories/role.repository";
import { RoleService } from "@app/common/services/role.service";
import { UserService } from "@app/common/services/user.service";
import { UserRepository } from "@app/common/repositories/user.repository";
import { DbConfigService } from "@app/common/config/db.config";

const services = [
  CacheConfigService,
  CommentService,
  PostService,
  RoleService,
  UserService,
  StoreService,
];

const repositories = [
  CommentRepository,
  PostRepository,
  RoleRepository,
  UserRepository,
];

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async (configService: ConfigService) =>
      new DbConfigService(configService).getDataSource().initialize(),
    inject: [ConfigService],
  },
];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService,
    }),
    MinioModule.registerAsync({
      isGlobal: true,
      useClass: MinioConfigService,
    }),
  ],
  controllers: [],
  providers: [...services, ...repositories, ...databaseProviders],
  exports: [...services, ...repositories, ...databaseProviders],
})
export class CommonModule {}
