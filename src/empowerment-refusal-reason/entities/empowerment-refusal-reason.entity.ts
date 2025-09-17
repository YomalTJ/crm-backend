import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('empowerment_refusal_reasons')
export class EmpowermentRefusalReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason_si: string;

  @Column()
  reason_en: string;

  @Column()
  reason_ta: string;
}