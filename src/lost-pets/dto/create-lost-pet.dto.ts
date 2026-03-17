import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLostPetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  species: string;

  @IsString()
  breed: string;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  photo_url?: string;

  @IsString()
  owner_name: string;

  @IsEmail()
  owner_email: string;

  @IsString()
  owner_phone: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  address: string;

  @IsString()
  lost_date: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}