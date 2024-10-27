import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class BatchValidationPipe extends ValidationPipe {
    constructor(private readonly isBatch: boolean) {
        super();
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        if (this.isBatch) {
            value.body.forEach((item) => delete item.schoolYear); // Remove fields for batch validation
            value.body.forEach((item) => delete item.semester); // Remove fields for batch validation
        }
        return super.transform(value, metadata);
    }
}
