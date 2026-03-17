import { Body, Controller, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly service: FoundPetsService) {}

  @Post()
  create(@Body() dto: CreateFoundPetDto) {
    return this.service.create(dto);
  }
}