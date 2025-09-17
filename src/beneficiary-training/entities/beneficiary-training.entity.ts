import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Course } from 'src/course/entities/course.entity';
import { District } from 'src/location/entities/district.entity';
import { Ds } from 'src/location/entities/ds.entity';
import { Gnd } from 'src/location/entities/gnd.entity';
import { Zone } from 'src/location/entities/zone.entity';

@Entity('beneficiary_training')
export class BeneficiaryTraining {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: string;

  @Column({ name: 'ds_id', nullable: true })
  dsId: string;

  @Column({ name: 'zone_id', nullable: true })
  zoneId: string;

  @Column({ name: 'gnd_id', nullable: true })
  gndId: string;

  @Column({ name: 'hh_number', nullable: true })
  hhNumber: string;

  @Column({ name: 'nic_number', nullable: true })
  nicNumber: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  address: string;

  @Column({ name: 'phone_number' })
  @IsNotEmpty()
  phoneNumber: string;

  @Column({ name: 'training_activities_done', default: false })
  trainingActivitiesDone: boolean;

  @Column({ name: 'training_activities_required', default: false })
  trainingActivitiesRequired: boolean;

  @Column({ name: 'course_id', nullable: true })
  courseId: number;

  @Column({ name: 'training_institution', nullable: true })
  trainingInstitution: string;

  @Column({ name: 'training_institute_address', nullable: true })
  trainingInstituteAddress: string;

  @Column({ name: 'training_institute_phone', nullable: true })
  trainingInstitutePhone: string;

  @Column({
    name: 'course_cost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  courseCost: number;

  @Column({ name: 'training_duration', nullable: true })
  trainingDuration: string;

  @Column({ name: 'trainer_name', nullable: true })
  trainerName: string;

  @Column({ name: 'trainer_contact_number', nullable: true })
  trainerContactNumber: string;

  // Relations for fetching details
  @ManyToOne(() => District, { eager: false })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Ds, { eager: false })
  @JoinColumn({ name: 'ds_id' })
  ds: Ds;

  @ManyToOne(() => Zone, { eager: false })
  @JoinColumn({ name: 'zone_id' })
  zone: Zone;

  @ManyToOne(() => Gnd, { eager: false })
  @JoinColumn({ name: 'gnd_id' })
  gnd: Gnd;

  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;
}
