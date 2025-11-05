import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base-entity/base.entity";
import { ColumnNameEnum } from "src/enums/column-name.enum";
import { Expose } from "class-transformer";
import { PresetEntity } from "./preset.entity";

@Entity('preset-settings')
export default class PresetSettingEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 64 })
  public name!: ColumnNameEnum | string;


  @Column({ nullable: true })
  @Expose({ name: 'display_index' })
  public displayIndex?: number;

  @ManyToOne(()=> PresetEntity, (preset)=> preset.presetSettings)
  public preset: PresetEntity;
}