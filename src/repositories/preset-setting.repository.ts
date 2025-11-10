import { Injectable, InternalServerErrorException } from "@nestjs/common";
import PresetSettingEntity from "src/entities/preset-setting.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class PresetSettingRepository extends Repository<PresetSettingEntity> {
    constructor(private readonly datasource:DataSource){
        super(PresetSettingEntity, datasource.createEntityManager())
    }

    async savePresetSetting(preset:PresetSettingEntity){
        const qr = this.datasource.createQueryRunner()
        try {
            await qr.connect()
            await qr.startTransaction()
            await qr.manager.save(preset)
            await qr.commitTransaction()
            return true
        } catch (error) {
            await qr.rollbackTransaction()            
            console.log(error);
            throw new InternalServerErrorException('internal server error');
        } finally {
            await qr.release()
        }
    }
}