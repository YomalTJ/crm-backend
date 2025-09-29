import { UserRole } from '../../user-role/entities/user-role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  nic: string;

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

  @BeforeInsert()
  @BeforeUpdate()
  generateUsername() {
    // For national level users (no location code), keep username as is
    if (!this.locationCode || this.locationCode.trim() === '') {
      return;
    }

    // For other users, generate username from location code without "-"
    this.username = this.locationCode.replace(/-/g, '');
  }
}
