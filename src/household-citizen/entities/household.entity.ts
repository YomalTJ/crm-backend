import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Citizen } from './citizen.entity';

@Entity('households')
export class Household {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'hh_reference', unique: true })
  hhReference: string;

  @Column({ name: 'gn_code' })
  gnCode: string;

  @Column({ name: 'applicant_name' })
  applicantName: string;

  @Column({ name: 'address_line_1', nullable: true })
  addressLine1: string;

  @Column({ name: 'address_line_2', nullable: true })
  addressLine2: string;

  @Column({ name: 'address_line_3', nullable: true })
  addressLine3: string;

  @Column({ name: 'single_mother', type: 'enum', enum: ['Yes', 'No'] })
  singleMother: 'Yes' | 'No';

  @Column()
  level: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Citizen, (citizen) => citizen.household)
  citizens: Citizen[];
}
