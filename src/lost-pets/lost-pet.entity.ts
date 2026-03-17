import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('lost_pets')
export class LostPet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column()
  breed: string;

  @Column()
  color: string;

  @Column()
  size: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  photo_url: string;

  @Column()
  owner_name: string;

  @Column()
  owner_email: string;

  @Column()
  owner_phone: string;

  @Column({
  type: 'geography',
  spatialFeatureType: 'Point',
  srid: 4326,
})
location: { type: 'Point'; coordinates: [number, number] };

  @Column()
  address: string;

  @Column({ type: 'timestamp' })
  lost_date: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}