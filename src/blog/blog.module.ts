import { Module } from "@nestjs/common";
import { NestjsFormDataModule } from "nestjs-form-data";
import { CommentController } from "@app/blog/controllers/comment.controller";
import { CommentMapper } from "@app/blog/mappers/comment.mapper";
import { PostController } from "@app/blog/controllers/post.controller";
import { PostMapper } from "@app/blog/mappers/post.mapper";

const controllers = [CommentController, PostController];

const mappers = [CommentMapper, PostMapper];

@Module({
  imports: [NestjsFormDataModule],
  controllers: [...controllers],
  providers: [...mappers],
})
export class BlogModule {}
