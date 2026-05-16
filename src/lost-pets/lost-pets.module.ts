import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostPetsService } from './lost-pets.service';
import { LostPetsController } from './lost-pets.controller';
import { LostPet } from './lost-pet.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LostPet]),
    RedisModule,
  ],
  controllers: [LostPetsController],
  providers: [LostPetsService],
  exports: [LostPetsService],
})
export class LostPetsModule {}