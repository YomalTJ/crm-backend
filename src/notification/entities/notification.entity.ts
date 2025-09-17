import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ 
    type: 'enum', 
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info'
  })
  type: string;

  @Column({ 
    type: 'enum', 
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  })
  status: string;

  @Column({ type: 'uuid', nullable: true })
  member_id: string;

  @Column({ type: 'uuid', nullable: true })
  staff_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  read_at: Date;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;
}