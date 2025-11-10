import { IsOptional, IsString } from "class-validator";

export class PresetQuery {
    @IsOptional()
    @IsString()
    public search?: string;
}