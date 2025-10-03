import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Staff } from '../../staff/entities/staff.entity';
import { SystemModules } from 'src/module/entities/module.entity';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => SystemModules, (module) => module.roles)
  module: SystemModules;

  @Column({ default: false })
  canAdd: boolean;

  @Column({ default: false })
  canUpdate: boolean;

  @Column({ default: false })
  canDelete: boolean;

  @OneToMany(() => Staff, (staff) => staff.role)
  staff: Staff[];
}
