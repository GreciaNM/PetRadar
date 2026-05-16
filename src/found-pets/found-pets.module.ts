import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundPetsService } from './found-pets.service';
import { FoundPetsController } from './found-pets.controller';
import { FoundPet } from './found-pet.entity';
import { LostPet } from '../lost-pets/lost-pet.entity';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoundPet, LostPet]),
    MailModule,
    RedisModule,
  ],
  controllers: [FoundPetsController],
  providers: [FoundPetsService],
})
export class FoundPetsModule {}