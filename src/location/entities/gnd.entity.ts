import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('gnd')
export class Gnd {
  @PrimaryColumn()
  gnd_id: string;

  @Column()
  zone_id: string;

  @Column()
  id: string;

  @Column()
  gnd_name: string;

  @Column()
  status: boolean;
}
