import { ConfigurableModuleOptionsFactory, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MinioConfigService
  implements ConfigurableModuleOptionsFactory<any, "create">
{
  constructor(private configService: ConfigService) {}

  create(): Promise<any> | any {
    return {
      endPoint: this.configService.get("MINIO_ENDPOINT"),
      port: parseInt(this.configService.get("MINIO_PORT")),
      useSSL: false,
      accessKey: this.configService.get("MINIO_ACCESS_KEY"),
      secretKey: this.configService.get("MINIO_SECRET_KEY"),
    };
  }
}
