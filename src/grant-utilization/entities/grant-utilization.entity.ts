import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { SamurdhiFamily } from 'src/samurdhi-family/entities/samurdhi-family.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class GrantUtilization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'hhNumber_or_nic' })
  hhNumberOrNic: string;

  // Basic grant information
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  grantDate: Date;

  // Livelihood/Self-employment section
  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ nullable: true })
  equipmentPurchased: string;

  @Column({ nullable: true })
  animalsPurchased: string;

  @Column({ nullable: true })
  plantsPurchased: string;

  @Column({ nullable: true })
  othersPurchased: string;

  @Column({ type: 'date', nullable: true })
  projectStartDate: Date;

  // Employment/Training section
  @Column({ nullable: true })
  employmentOpportunities: string;

  @Column({ nullable: true })
  traineeName: string;

  @Column({ nullable: true })
  traineeAge: number;

  @Column({ nullable: true })
  traineeGender: string;

  @Column({ nullable: true })
  courseName: string;

  @Column({ nullable: true })
  institutionName: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  courseFee: number;

  @Column({ nullable: true })
  courseDuration: string;

  @Column({ type: 'date', nullable: true })
  courseStartDate: Date;

  @Column({ type: 'date', nullable: true })
  courseEndDate: Date;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  createdBy: Staff;
}
