import { UserRole } from 'src/user-role/entities/user-role.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class SystemModules {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => UserRole, (role) => role.module)
  roles: UserRole[];
}
