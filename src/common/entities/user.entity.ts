import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "@app/common/entities/role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: false, default: false })
  enabled: boolean;

  @UpdateDateColumn({ nullable: false })
  updatedAt: string;

  @CreateDateColumn({ nullable: false })
  createdAt: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: "user_role",
    joinColumn: { name: "userId" },
    inverseJoinColumn: { name: "roleId" },
  })
  roles: Role[];
}
