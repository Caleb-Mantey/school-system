import User from './shared/user.shared.entity';
import { Entity, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
@Unique('UQ_EMAILS', ['email'])
@Unique(['phone'])
@Unique('UQ_PHONE', ['phone'])
export class Admin extends User {
  @Column({ default: 'Admin' })
  account_type: string;

  @Column()
  phone: string;

  @Column({ default: 'Read' })
  permissions: string;
}
