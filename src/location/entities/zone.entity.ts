import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('zone')
export class Zone {
  @PrimaryGeneratedColumn()
  zone_id: string;

  @Column()
  ds_id: string;

  @Column()
  id: string;

  @Column()
  zone_name: string;

  @Column()
  status: boolean;
}
