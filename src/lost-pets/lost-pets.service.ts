import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from './lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,
  ) {}

  async create(dto: CreateLostPetDto) {
    const pet = this.lostPetRepository.create({
      ...dto,
      lost_date: new Date(dto.lost_date),
      is_active: dto.is_active ?? true,
      location: {
        type: 'Point',
        coordinates: [dto.lng, dto.lat],
      },
    });

    return this.lostPetRepository.save(pet);
  }
}