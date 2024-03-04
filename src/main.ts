import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === "development") {
    const config = new DocumentBuilder()
      .setTitle("NestJs blog")
      .setDescription("The NestJs blog API")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(8000);
}
bootstrap();
