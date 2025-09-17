import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  district_id: string;

  @Column()
  province_id: string;

  @Column()
  id: string;

  @Column()
  district_name: string;

  @Column()
  status: boolean;
}
