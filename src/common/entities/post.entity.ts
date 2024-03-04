import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "@app/common/entities/user.entity";
import { Comment } from "@app/common/entities/comment.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ type: "text", nullable: false })
  body: string;

  @Column({ nullable: true })
  imageUrl: string;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @OneToMany(() => Comment, (comments) => comments.post, {
    cascade: true,
  })
  public comments!: Comment[];

  @ManyToOne(() => User, null)
  @JoinColumn({ name: "createdBy" })
  createdBy: User;
}
