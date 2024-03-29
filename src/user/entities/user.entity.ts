import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../dto/user.enum';
import { IsEmail, IsEnum, Length } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';
import { Review } from 'src/review/entities/review.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(2, 8)
  password: string;

  @Column()
  @IsEnum(UserRole)
  role: UserRole;

  @Column()
  accessToken: string;

  @OneToMany(() => Card, (cards) => cards.user)
  cards: Card[];

  @OneToMany(() => Review, (reviews) => reviews.user)
  reviews: Review[];

  @OneToMany(() => Review, (mReviews) => mReviews.merchant)
  mReviews: Review[];

  @OneToMany(() => Booking, (bookings) => bookings.user)
  bookings: Booking[];

  @OneToMany(() => Booking, (mBookings) => mBookings.merchant)
  mBookings: Booking[];

  @OneToMany(() => Payment, (payments) => payments.user)
  payments: Payment[];
}
