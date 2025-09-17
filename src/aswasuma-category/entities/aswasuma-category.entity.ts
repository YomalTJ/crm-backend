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
export class AswasumaCategory {
  @PrimaryGeneratedColumn('uuid')
  aswesuma_cat_id: string;

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
