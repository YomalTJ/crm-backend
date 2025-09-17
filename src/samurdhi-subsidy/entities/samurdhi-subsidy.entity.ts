import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Staff } from 'src/staff/entities/staff.entity';

@Entity()
export class SamurdhiSubsisdy {
  @PrimaryGeneratedColumn('uuid')
  subsisdy_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  createdBy: Staff;

  @CreateDateColumn()
  createdAt: Date;
}
