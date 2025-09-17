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
export class EmpowermentDimension {
  @PrimaryGeneratedColumn('uuid')
  empowerment_dimension_id: string;

  @Column()
  nameEnglish: string;

  @Column()
  nameSinhala: string;

  @Column()
  nameTamil: string;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  createdBy: Staff;

  @CreateDateColumn()
  createdAt: Date;
}