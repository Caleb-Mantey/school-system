import { sign } from 'jsonwebtoken';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken extends BaseEntity {
  constructor(init?: Partial<RefreshToken>) {
    super();
    Object.assign(this, init);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  userAgent: string;

  @Column()
  ipAddress: string;

  @Column({ default: 'Rider' })
  account_type: string;

  sign(): string {
    return sign({ ...this }, process.env.REFRESH_SECRET);
  }
}
