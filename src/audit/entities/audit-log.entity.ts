import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  entityName: string; // e.g., 'CurrentEmployment'

  @Column()
  entityId: string;

  @Column()
  action: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column('json', { nullable: true })
  oldData: any;

  @Column('json', { nullable: true })
  newData: any;

  @Column()
  performedBy: string; // Staff ID

  @CreateDateColumn()
  performedAt: Date;
}
