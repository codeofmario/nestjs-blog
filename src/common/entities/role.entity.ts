import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;
}
