import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { BookingStatus } from './dto/status.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
  ) {}
  create(merchantId: string, req: CreateBookingDto) {
    const booking: Partial<Booking> = {
      id: uuid(),
      details: req.details,
      status: BookingStatus.PENDING,
      merchantId: merchantId,
      userId: req.userId,
      serviceId: req.serviceId,
    };
    return this.bookingRepository.save(booking);
  }

  findAll(merchantId: string) {
    return this.bookingRepository.find({ where: { merchantId } });
  }

  findOne(id: string) {
    return this.bookingRepository.findOne({ where: { id } });
  }

  async update(id: string, req: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new HttpException('Invalid Booking Id', HttpStatus.NOT_FOUND);
    }
    booking.details = req.details ? req.details : booking.details;

    return this.bookingRepository.save(booking);
  }

  async confirmBooking(merchantId: string, id: string) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new HttpException('Invalid Booking Id', HttpStatus.NOT_FOUND);
    }
    if (booking.merchantId != merchantId) {
      throw new HttpException(
        'A merchant can only confirm booking booked by himself.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    booking.status = BookingStatus.COMPLETED;

    return this.bookingRepository.save(booking);
  }

  async rejectBooking(merchantId: string, id: string) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new HttpException('Invalid Booking Id', HttpStatus.NOT_FOUND);
    }
    if (booking.merchantId != merchantId) {
      throw new HttpException(
        'A merchant can only confirm booking booked by himself.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    booking.status = BookingStatus.REJECTED;

    return this.bookingRepository.save(booking);
  }

  async remove(id: string) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new HttpException('Invalid Booking Id', HttpStatus.NOT_FOUND);
    }
    await this.bookingRepository.delete({ id });
    return booking;
  }
}
