import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('found_pets')
export class FoundPet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  species: string;

  @Column({ nullable: true })
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
  finder_name: string;

  @Column()
  finder_email: string;

  @Column()
  finder_phone: string;

 @Column({
  type: 'geography',
  spatialFeatureType: 'Point',
  srid: 4326,
})
location: { type: 'Point'; coordinates: [number, number] };

  @Column()
  address: string;

  @Column({ type: 'timestamp' })
  found_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}