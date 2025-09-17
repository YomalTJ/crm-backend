import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('disability')
export class Disability {
  @PrimaryGeneratedColumn({ name: 'disability_id' })
  disabilityId: number;

  @Column({ name: 'name_en', length: 100 })
  nameEN: string;

  @Column({ name: 'name_si', length: 100 })
  nameSi: string;

  @Column({ name: 'name_ta', length: 100 })
  nameTa: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
