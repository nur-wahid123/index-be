import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base-entity/base.entity";
import { User } from "./user.entity";
import PresetSettingEntity from "./preset-setting.entity";
import { Expose } from "class-transformer";

@Entity()
export class PresetEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public name!: string;

    @ManyToOne(()=>User, (user)=> user.presets)
    public creator: User;

    @OneToMany(()=>PresetSettingEntity, (presetSetting)=> presetSetting.preset)
    @Expose({name: 'preset_settings'})
    public presetSettings: PresetSettingEntity[];
}