import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class BlacklistedToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  token: string;

  @Column()
  @Index() // Add index for expiration checks
  expiresAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: true })
  @Index() // Add index for validity checks
  isValid: boolean;

  @Column({ nullable: true })
  @Index() // Add index for user-specific operations
  userId: string;
}
