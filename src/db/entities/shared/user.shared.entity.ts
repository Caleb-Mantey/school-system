import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { encode } from '../../../utils/bcrypt';
import * as capitalize from 'voca/capitalize';
export default abstract class User extends BaseEntity {
  @BeforeInsert()
  beforeInsertActions() {
    this.encryptPassword();
    this.updateName();
  }

  @BeforeUpdate()
  beforeUpdateActions() {
    this.updateName();
  }

  encryptPassword() {
    if (this.password != null) this.password = encode(this.password);
  }
  updateName() {
    this.first_name = capitalize(this.first_name);
    this.last_name = capitalize(this.last_name);
    this.name = `${this.first_name} ${this.last_name}`;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  name: string;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  @Exclude()
  password: string;

  @Column({ default: false })
  push: boolean;

  @Column({ default: false })
  email_notification: boolean;

  @Column({ default: false })
  sms: boolean;

  @Column()
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
