import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

const optionsV4 = {
  node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
  clockseq: 0x1234,
  msecs: new Date(Date.now()).getTime(),
  nsecs: 5678,
};

@Entity()
export class ApiAuths extends BaseEntity {
  @BeforeInsert()
  generateApiKey() {
    this.api_key = uuidv4(optionsV4);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  api_key: string;

  @Column({ default: true })
  active: boolean;
}
