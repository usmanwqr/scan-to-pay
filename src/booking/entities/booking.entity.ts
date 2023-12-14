import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IsEnum } from 'class-validator';
import { BookingStatus } from '../dto/status.enum';
import { Service } from 'src/service/entities/service.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  details: string;

  @Column()
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => User, (merchant) => merchant.mBookings)
  merchant: User;

  @Column()
  merchantId: string;

  @OneToOne(() => Service, (service) => service.booking)
  service: Service;

  @Column()
  serviceId: string;
}
