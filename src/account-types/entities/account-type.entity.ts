import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('samurdhi_account_types')
export class AccountType {
  static readonly SEED_DATA = [
    { name: 'Saving' },
    { name: 'Diriya Matha' },
    { name: 'Kekulu Lama' },
  ];

  @PrimaryGeneratedColumn()
  samurdhi_bank_account_type_id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
