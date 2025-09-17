import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ds')
export class Ds {
  @PrimaryGeneratedColumn()
  ds_id: string;

  @Column()
  district_id: string;

  @Column()
  id: string;

  @Column()
  ds_name: string;

  @Column()
  status: boolean;
}
