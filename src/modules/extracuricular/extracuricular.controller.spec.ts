import { Test, TestingModule } from '@nestjs/testing';
import { ExtracuricularController } from './extracuricular.controller';
import { ExtracuricularService } from './extracuricular.service';

describe('ExtracuricularController', () => {
  let controller: ExtracuricularController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtracuricularController],
      providers: [ExtracuricularService],
    }).compile();

    controller = module.get<ExtracuricularController>(ExtracuricularController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
