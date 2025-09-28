import { UserRole } from '../../user-role/entities/user-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username', 'locationCode'])
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: false })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'varchar',
    select: false,
    nullable: true,
  })
  wbbPassword: string | null;

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

  @Column({ type: 'varchar', nullable: true })
  uniqueConstraint: string;
}
