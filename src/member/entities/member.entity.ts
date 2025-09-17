import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  nic: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @ManyToOne(() => User)
  @JoinColumn()
  addedBy: User;
}
