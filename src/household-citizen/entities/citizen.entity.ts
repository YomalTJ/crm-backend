import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Household } from './household.entity';

@Entity('citizens')
export class Citizen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'hh_reference' })
  hhReference: string;

  @Column()
  name: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'] })
  gender: 'male' | 'female' | 'other';

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

  @ManyToOne(() => Household, (household) => household.citizens)
  @JoinColumn({ name: 'hh_reference', referencedColumnName: 'hhReference' })
  household: Household;
}
