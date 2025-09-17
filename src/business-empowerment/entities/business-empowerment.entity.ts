import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@Entity('business_empowerments')
export class BusinessEmpowerment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Mandatory Fields
  @Column({ type: 'varchar', length: 12 })
  @IsNotEmpty()
  @Index()
  nic: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  name: string;

  @Column({ type: 'varchar', length: 15 })
  @IsPhoneNumber()
  phone: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  address: string;

  // Location IDs (mandatory)
  @Column()
  @IsNotEmpty()
  district_id: string;

  @Column()
  @IsNotEmpty()
  ds_id: string;

  @Column()
  @IsNotEmpty()
  zone_id: string;

  @Column()
  @IsNotEmpty()
  gnd_id: string;

  // Optional Fields
  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  livelihood_id?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  project_type_id?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  job_field_id?: string;

  // Financial Contributions (optional)
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  governmentContribution?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  beneficiaryContribution?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  bankLoan?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  linearOrganizationContribution?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  total?: number;

  // Project Assets and Expectations (optional)
  @Column({ type: 'text', nullable: true })
  @IsOptional()
  capitalAssets?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  expectedMonthlyProfit?: number;

  // Ministry/Department Information (optional)
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  advisingMinistry?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  officerName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  officerPosition?: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  @IsOptional()
  @IsPhoneNumber('LK')
  officerMobileNumber?: string;

  // Staff References as strings (optional)
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  developmentOfficer?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  projectManager?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  technicalOfficer?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  divisionalSecretary?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
