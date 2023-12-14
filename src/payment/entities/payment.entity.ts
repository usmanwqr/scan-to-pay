import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IsEnum } from 'class-validator';
import { Status } from '../../booking/dto/status.enum';
import { Card } from 'src/card/entities/card.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { MethodType } from '../dto/method-type.enum';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  details: string;

  @Column()
  @IsEnum(Status)
  status: Status;

  @Column()
  @IsEnum(MethodType)
  methodType: MethodType;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Card, (card) => card.payments, { nullable: true })
  card: Card;

  @Column({ nullable: true })
  cardId: string;

  @OneToOne(() => Booking, (booking) => booking.payment)
  booking: Booking;

  @Column()
  bookingId: string;
}
