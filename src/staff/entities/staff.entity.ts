import { UserRole } from '../../user-role/entities/user-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  language: string;

  @Column({ nullable: true })
  locationCode: string;

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'addedById' })
  addedBy: Staff | null;

  @ManyToOne(() => UserRole, { eager: true })
  @JoinColumn()
  role: UserRole;
}
