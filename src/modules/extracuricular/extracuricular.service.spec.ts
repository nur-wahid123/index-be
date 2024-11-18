import { Test, TestingModule } from '@nestjs/testing';
import { ExtracuricularService } from './extracuricular.service';

describe('ExtracuricularService', () => {
  let service: ExtracuricularService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtracuricularService],
    }).compile();

    service = module.get<ExtracuricularService>(ExtracuricularService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
