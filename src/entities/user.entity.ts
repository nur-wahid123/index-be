import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity/base.entity';
import { Gender } from './../enums/gender.enum';
import { Roles } from './../enums/roles.enum';
import { PresetEntity } from './preset.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  /**
   * Columns
   */

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 30, nullable: false, default: 'name' })
  name?: string;

  @Column({ type: 'varchar', length: 15 })
  username?: string;

  @Column({ type: 'varchar', length: 40, nullable: true })
  email?: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'varchar' })
  @Exclude()
  password?: string;

  @Column({ enum: Roles, nullable: false, default: Roles.ADMIN })
  role?: Roles;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  /**
   * m - male
   * f - female
   * u - unspecified
   */
  gender?: Gender;

  /**
   * Relations
   */

  @OneToMany(()=> PresetEntity, (preset)=> preset.creator)
  public presets: PresetEntity[]
}
