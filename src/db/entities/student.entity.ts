import User from './shared/user.shared.entity';
import { Entity, Column, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
@Unique('UQ_EMAILS', ['email'])
@Unique(['phone'])
@Unique('UQ_PHONE', ['phone'])
export class Student extends User {
  @Column({ default: 'Student' })
  account_type: string;
}
