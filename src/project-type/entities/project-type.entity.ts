import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Staff } from 'src/staff/entities/staff.entity';
import { Livelihood } from 'src/livelihoods/entities/livelihood.entity';
@Entity()
export class ProjectType {
  @PrimaryGeneratedColumn()
  project_type_id: string;

  @Column()
  nameEnglish: string;

  @Column()
  nameSinhala: string;

  @Column()
  nameTamil: string;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  createdBy: Staff;

  @ManyToOne(() => Livelihood, { eager: true })
  @JoinColumn({ name: 'livelihood_id' })
  livelihood: Livelihood;

  @CreateDateColumn()
  createdAt: Date;
}
