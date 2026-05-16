import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundPet } from './found-pet.entity';
import { CreateFoundPetDto } from './dto/create-found-pet.dto';
import { LostPet } from '../lost-pets/lost-pet.entity';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class FoundPetsService {
  constructor(
    @InjectRepository(FoundPet)
    private readonly foundPetRepository: Repository<FoundPet>,

    @InjectRepository(LostPet)
    private readonly lostPetRepository: Repository<LostPet>,

    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async create(dto: CreateFoundPetDto) {
    const foundPet = this.foundPetRepository.create({
      ...dto,
      found_date: new Date(dto.found_date),
      location: {
        type: 'Point',
        coordinates: [dto.lng, dto.lat],
      },
    });

    const saved = await this.foundPetRepository.save(foundPet);

    await this.redisService.del('found-pets');

    const nearbyLostPets = await this.lostPetRepository.query(
      `
      SELECT
        id,
        name,
        species,
        breed,
        color,
        size,
        description,
        photo_url,
        owner_name,
        owner_email,
        owner_phone,
        address,
        lost_date,
        is_active,
        ST_X(location::geometry) AS lng,
        ST_Y(location::geometry) AS lat,
        ST_Distance(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) AS distance
      FROM lost_pets
      WHERE is_active = true
        AND ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          500
        )
      ORDER BY distance ASC;
      `,
      [dto.lng, dto.lat],
    );

    const genericEmail = this.configService.get<string>('GENERIC_NOTIFY_EMAIL');
    let emailSent = false;

    const cleanMatches = nearbyLostPets.map((pet: any) => ({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      color: pet.color,
      size: pet.size,
      description: pet.description,
      photo_url: pet.photo_url,
      owner_name: pet.owner_name,
      owner_email: pet.owner_email,
      owner_phone: pet.owner_phone,
      address: pet.address,
      lost_date: pet.lost_date,
      is_active: pet.is_active,
      lat: Number(pet.lat),
      lng: Number(pet.lng),
      distance_meters: Number(pet.distance).toFixed(2),
    }));

    if (genericEmail && cleanMatches.length > 0) {
      for (const lostPet of cleanMatches) {
        const mapUrl = this.mailService.buildMapUrl(
          Number(lostPet.lng),
          Number(lostPet.lat),
          dto.lng,
          dto.lat,
        );

        await this.mailService.sendFoundPetNotification(genericEmail, {
          found_species: dto.species,
          found_breed: dto.breed,
          found_color: dto.color,
          found_size: dto.size,
          found_description: dto.description,
          finder_name: dto.finder_name,
          finder_email: dto.finder_email,
          finder_phone: dto.finder_phone,
          found_address: dto.address,

          lost_name: lostPet.name,
          lost_species: lostPet.species,
          lost_breed: lostPet.breed,
          lost_color: lostPet.color,
          lost_size: lostPet.size,
          lost_description: lostPet.description,
          lost_owner_name: lostPet.owner_name,
          lost_owner_email: lostPet.owner_email,
          lost_owner_phone: lostPet.owner_phone,
          lost_address: lostPet.address,
          distance_meters: lostPet.distance_meters,

          mapUrl,
        });
      }

      emailSent = true;
    }

    return {
      message: 'Mascota encontrada registrada correctamente',
      foundPet: saved,
      matchesFound: cleanMatches.length,
      matches: cleanMatches,
      emailSent,
    };
  }

  async findAll() {
    const cache = await this.redisService.get('found-pets');

    if (cache) {
      return JSON.parse(cache);
    }

    const pets = await this.foundPetRepository.find();

    await this.redisService.set(
      'found-pets',
      JSON.stringify(pets),
      60,
    );

    return pets;
  }
}