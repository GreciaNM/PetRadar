import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostPet } from './lost-pet.entity';
import { CreateLostPetDto } from './dto/create-lost-pet.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class LostPetsService {
  constructor(
    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,

    private readonly redisService: RedisService,
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

    const savedPet = await this.lostPetRepository.save(pet);

    await this.redisService.del('lost-pets');

    return savedPet;
  }

  async findAll() {
    const cache = await this.redisService.get('lost-pets');

    if (cache) {
      return JSON.parse(cache);
    }

    const pets = await this.lostPetRepository.find({
      where: {
        is_active: true,
      },
    });

    await this.redisService.set(
      'lost-pets',
      JSON.stringify(pets),
      60,
    );

    return pets;
  }
}