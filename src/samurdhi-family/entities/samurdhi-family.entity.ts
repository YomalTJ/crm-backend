import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { BeneficiaryStatus } from '../../beneficiary-status/entities/beneficiary-status.entity';
import { CurrentEmployment } from '../../current-employment/entities/current-employment.entity';
import { SamurdhiSubsisdy } from '../../samurdhi-subsidy/entities/samurdhi-subsidy.entity';
import { AswasumaCategory } from '../../aswasuma-category/entities/aswasuma-category.entity';
import { EmpowermentDimension } from '../../empowerment-dimension/entities/empowerment-dimension.entity';
import { ProjectType } from '../../project-type/entities/project-type.entity';
import { JobField } from '../../job-field/entities/job-field.entity';
import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Zone } from 'src/location/entities/zone.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { EmpowermentRefusalReason } from 'src/empowerment-refusal-reason/entities/empowerment-refusal-reason.entity';
import { Disability } from 'src/disability/entities/disability.entity';
import { Livelihood } from 'src/livelihoods/entities/livelihood.entity';

export enum MainProgram {
  NP = 'NP', // National Program
  ADB = 'ADB', // ADB Program
  WB = 'WB', // World Bank Program
}

export enum AreaClassification {
  URBAN = 'නාගරික/ Urban/ நகர்ப்புற',
  RURAL = 'ග්‍රාමීය/ Rural/ கிராமப்புறம்',
  ESTATE = 'වතු/ Estates / எஸ்டேட்ஸ்',
}

@Entity()
export class SamurdhiFamily {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Ds)
  @JoinColumn({ name: 'ds_id' })
  divisionalSecretariat: Ds;

  @ManyToOne(() => Zone)
  @JoinColumn({ name: 'zone_id' })
  samurdhiBank: Zone;

  @ManyToOne(() => Gnd)
  @JoinColumn({ name: 'gnd_id' })
  gramaNiladhariDivision: Gnd;

  @ManyToOne(() => BeneficiaryStatus)
  @JoinColumn({ name: 'beneficiary_type_id' })
  beneficiaryType: BeneficiaryStatus;

  @Column({
    type: 'enum',
    enum: AreaClassification,
    nullable: true,
  })
  areaClassification: AreaClassification;

  @Column({
    type: 'enum',
    enum: MainProgram,
    nullable: true,
  })
  mainProgram: MainProgram;

  @Column({ nullable: true })
  hasConsentedToEmpowerment: boolean;

  @Column({ nullable: true })
  isImpactEvaluation: boolean;

  @Column({ nullable: true })
  consentLetterPath: string;

  @ManyToOne(() => EmpowermentRefusalReason, { nullable: true })
  @JoinColumn({ name: 'refusal_reason_id' })
  refusalReason: EmpowermentRefusalReason;

  @Column({ type: 'timestamp', nullable: true })
  consentGivenAt: Date;

  @Column({ nullable: true })
  aswasumaHouseholdNo: string;

  @Column({ nullable: false })
  nic: string;

  @Column()
  beneficiaryName: string;

  @Column({ nullable: true })
  beneficiaryAge: number;

  @Column()
  beneficiaryGender: string;

  @Column()
  address: string;

  @Column()
  mobilePhone: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  projectOwnerName: string;

  @Column({ nullable: true })
  projectOwnerAge: number;

  @Column({ nullable: true })
  projectOwnerGender: string;

  @Column({ nullable: true })
  hasDisability: boolean;

  @ManyToOne(() => Disability, { nullable: true })
  @JoinColumn({ name: 'disability_id' })
  disability: Disability | null;

  @Column({ default: 0 })
  maleBelow16: number;

  @Column({ default: 0 })
  femaleBelow16: number;

  @Column({ default: 0 })
  male16To24: number;

  @Column({ default: 0 })
  female16To24: number;

  @Column({ default: 0 })
  male25To45: number;

  @Column({ default: 0 })
  female25To45: number;

  @Column({ default: 0 })
  male46To60: number;

  @Column({ default: 0 })
  female46To60: number;

  @Column({ default: 0 })
  maleAbove60: number;

  @Column({ default: 0 })
  femaleAbove60: number;

  // Occupational Info
  @ManyToOne(() => CurrentEmployment)
  @JoinColumn({ name: 'employment_id' })
  currentEmployment: CurrentEmployment;

  @Column({ nullable: true })
  otherOccupation: string;

  @ManyToOne(() => SamurdhiSubsisdy)
  @JoinColumn({ name: 'subsisdy_id' })
  samurdhiSubsidy: SamurdhiSubsisdy;

  @ManyToOne(() => AswasumaCategory, { nullable: true })
  @JoinColumn({ name: 'aswesuma_cat_id' })
  aswasumaCategory: AswasumaCategory;

  @ManyToOne(() => EmpowermentDimension)
  @JoinColumn({ name: 'empowerment_dimension_id' })
  empowermentDimension: EmpowermentDimension;

  // For Business Opportunities
  @ManyToOne(() => Livelihood)
  @JoinColumn({ name: 'livelihood_id' })
  livelihood: Livelihood;

  @ManyToOne(() => ProjectType)
  @JoinColumn({ name: 'project_type_id' })
  projectType: ProjectType;

  @Column({ nullable: true })
  otherProject: string;

  // For Employment Facilitation
  @Column({ nullable: true, type: 'varchar' })
  childName: string | null;

  @Column({ nullable: true, type: 'int' })
  childAge: number | null;

  @Column({ nullable: true, type: 'varchar' })
  childGender: string | null;

  @ManyToOne(() => JobField, { nullable: true })
  @JoinColumn({ name: 'job_field_id' })
  jobField?: JobField;

  @Column({ nullable: true })
  otherJobField: string;

  // Array columns for multiple selections - stored as JSON
  @Column('json', { nullable: true })
  resource_id: string[];

  @Column()
  monthlySaving: boolean;

  @Column({ nullable: true, type: 'int' })
  savingAmount: number | null;

  @Column('json', { nullable: true })
  health_indicator_id: string[];

  @Column('json', { nullable: true })
  domestic_dynamic_id: string[];

  @Column('json', { nullable: true })
  community_participation_id: string[];

  @Column('json', { nullable: true })
  housing_service_id: string[];

  @Column({ nullable: true })
  commercialBankAccountName: string;

  @Column({ nullable: true })
  commercialBankAccountNumber: string;

  @Column({ nullable: true })
  commercialBankName: string;

  @Column({ nullable: true })
  commercialBankBranch: string;

  @Column({ nullable: true })
  samurdhiBankAccountName: string;

  @Column({ nullable: true })
  samurdhiBankAccountNumber: string;

  @Column({ nullable: true })
  samurdhiBankName: string;

  @Column({ nullable: true })
  samurdhiBankAccountType: string;

  // Bank transfer preference
  @Column({ nullable: true })
  wantsAswesumaBankTransfer: boolean;

  @Column({ nullable: true })
  otherBankName: string;

  @Column({ nullable: true })
  otherBankBranch: string;

  @Column({ nullable: true })
  otherBankAccountHolder: string;

  @Column({ nullable: true })
  otherBankAccountNumber: string;

  // Government subsidy
  @Column({ nullable: true })
  hasOtherGovernmentSubsidy: boolean;

  @Column({ nullable: true })
  otherGovernmentInstitution: string;

  @Column({ nullable: true })
  otherSubsidyAmount: number;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'created_by' })
  createdBy: Staff;

  @CreateDateColumn()
  createdAt: Date;
}
