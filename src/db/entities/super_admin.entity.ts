import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Entity,
  BeforeUpdate,
  Unique,
} from 'typeorm';

import { encode } from '../../utils/bcrypt';

@Entity()
@Unique(['email'])
@Unique('UQ_EMAILS', ['email'])
export class SuperAdmin extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    if (this.password != null) this.password = encode(this.password);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
