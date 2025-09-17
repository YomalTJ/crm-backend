import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn()
  province_id: number;

  @Column()
  id: string;

  @Column()
  province_name: string;

  @Column()
  status: boolean;
}
