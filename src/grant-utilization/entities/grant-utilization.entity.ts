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

  // Location IDs
  @Column({ name: 'district_id', nullable: true })
  districtId: string;

  @Column({ name: 'ds_id', nullable: true })
  dsId: string;

  @Column({ name: 'zone_id', nullable: true })
  zoneId: string;

  @Column({ name: 'gnd_id', nullable: true })
  gndId: string;

  // Basic grant information
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  grantDate: Date;

  // Grant type fields
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  financialAid: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  interestSubsidizedLoan: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  samurdiBankLoan: number;

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
