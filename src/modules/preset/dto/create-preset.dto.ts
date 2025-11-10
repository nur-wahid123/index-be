import { IsArray, IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ColumnNameEnum } from "src/enums/column-name.enum";

export class CreatePresetDto{
    @IsNotEmpty()
    @IsString()
    public name!: string;

    @IsNotEmpty()
    @IsArray()
    @IsEnum(ColumnNameEnum, { each: true })
    public items!: ColumnNameEnum[];


}