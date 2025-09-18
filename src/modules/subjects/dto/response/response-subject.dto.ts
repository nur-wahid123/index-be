import { Expose } from 'class-transformer';
import { Subject } from 'src/entities/subject.entity';

export class ResponseSubjectDto extends Subject {
  @Expose({ name: 'fake_display_index' })
  fakeDisplayIndex?: number;
}
