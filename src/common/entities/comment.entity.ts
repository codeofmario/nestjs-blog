import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "@app/common/entities/post.entity";
import { User } from "@app/common/entities/user.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: false })
  body: string;

  @Column()
  public postId!: string;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @ManyToOne(() => Post, (post) => post.comments, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  @JoinColumn({ name: "postId" })
  public post!: Post;

  @ManyToOne(() => User, null)
  @JoinColumn({ name: "createdBy" })
  createdBy: User;
}
