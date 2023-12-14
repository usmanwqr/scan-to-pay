import { Booking } from 'src/booking/entities/booking.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @OneToOne(() => Booking, (booking) => booking.service)
  booking: Booking;
}
