import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoundPetsService } from './found-pets.service';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';

@Controller('found-pets')
export class FoundPetsController {
  constructor(private readonly foundPetsService: FoundPetsService) {}

  @Post()
  create(@Body() dto: CreateFoundPetDto) {
    return this.foundPetsService.create(dto);
  }

  @Get()
  findAll() {
    return this.foundPetsService.findAll();
  }
}