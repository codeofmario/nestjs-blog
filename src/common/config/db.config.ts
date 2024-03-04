import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { Injectable } from "@nestjs/common";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: ".env" });

@Injectable()
export class DbConfigService {
  private dataSource: DataSource;

  constructor(private service: ConfigService) {}

  getDataSource(): DataSource {
    if (!this.dataSource) {
      this.dataSource = new DataSource(this.getOptions());
    }

    return this.dataSource;
  }

  private getOptions(): DataSourceOptions & SeederOptions {
    return {
      type: "postgres",
      host: this.service.get("DB_HOST"),
      port: this.service.get("DB_PORT"),
      username: this.service.get("DB_USERNAME"),
      password: this.service.get("DB_PASSWORD"),
      database: this.service.get("DB_NAME"),
      synchronize: false,
      migrationsRun: false,
      entities: [__dirname + "/../entities/**/*{.ts,.js}"],
      migrations: [__dirname + "/../migrations/**/*{.ts,.js}"],
      seeds: [__dirname + "/../seeds/**/*{.ts,.js}"],
      factories: [__dirname + "/../factories/**/*{.ts,.js}"],
    };
  }
}

const dataSource = new DbConfigService(new ConfigService()).getDataSource();
export default dataSource;
