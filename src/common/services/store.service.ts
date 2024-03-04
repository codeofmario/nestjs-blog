import { Injectable } from "@nestjs/common";
import { MemoryStoredFile } from "nestjs-form-data";
import { MinioService } from "nestjs-minio-client";
import { v4 as uuid } from "uuid";

@Injectable()
export class StoreService {
  private bucketName = "nestjsblog";

  constructor(private service: MinioService) {}

  async store(file?: MemoryStoredFile): Promise<string> {
    if (!file) {
      return null;
    }

    const id = uuid();
    await this.service.client.putObject(
      this.bucketName,
      id,
      file.buffer,
      file.size,
      { "Content-Type": file.mimeType }
    );
    return `/assets/images/${id}`;
  }

  async delete(url?: string): Promise<boolean> {
    if (!url) {
      return false;
    }

    const id = url.split("/").at(-1).split(".").at(0);
    await this.service.client.removeObject(this.bucketName, id);
    return true;
  }
}
