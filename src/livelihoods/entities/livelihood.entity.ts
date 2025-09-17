import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('livelihoods')
export class Livelihood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci' })
  @IsNotEmpty()
  english_name: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci' })
  @IsNotEmpty()
  sinhala_name: string;

  @Column({ type: 'varchar', length: 100, collation: 'utf8mb4_unicode_ci' })
  @IsNotEmpty()
  tamil_name: string;
}
