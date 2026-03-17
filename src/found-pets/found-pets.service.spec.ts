import { Test, TestingModule } from '@nestjs/testing';
import { FoundPetsService } from './found-pets.service';

describe('FoundPetsService', () => {
  let service: FoundPetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoundPetsService],
    }).compile();

    service = module.get<FoundPetsService>(FoundPetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
