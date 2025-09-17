import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_english' })
  @IsNotEmpty()
  nameEnglish: string;

  @Column({ name: 'name_sinhala' })
  @IsNotEmpty()
  nameSinhala: string;

  @Column({ name: 'name_tamil' })
  @IsNotEmpty()
  nameTamil: string;
}
