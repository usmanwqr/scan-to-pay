import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Status } from 'src/booking/dto/status.enum';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}
  async create(userId: string, req: CreatePaymentDto) {
    const checkPayment = await this.paymentRepository.findOne({
      where: { bookingId: req.bookingId, status: Status.COMPLETED },
    });
    if (checkPayment) {
      throw new HttpException(
        'Payment already made for this booking',
        HttpStatus.BAD_REQUEST,
      );
    }
    const payment: Partial<Payment> = {
      id: uuid(),
      details: req.details,
      status: Status.PENDING,
      bookingId: req.bookingId,
      userId: userId,
      cardId: req.cardId,
      methodType: req.methodType,
    };
    return this.paymentRepository.save(payment);
  }

  async findOne(userId: string, id: string) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new HttpException('Invalid Payment Id', HttpStatus.NOT_FOUND);
    }
    if (payment.userId != userId) {
      throw new HttpException(
        'A payment can be only seen by user who made it or merchant',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return payment;
  }

  async update(userId: string, id: string, req: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new HttpException('Invalid Payment Id', HttpStatus.NOT_FOUND);
    }
    payment.details = req.details ? req.details : payment.details;

    return this.paymentRepository.save(payment);
  }

  async confirmPayment(id: string) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new HttpException('Invalid payment Id', HttpStatus.NOT_FOUND);
    }

    payment.status = Status.COMPLETED;

    return this.paymentRepository.save(payment);
  }

  async rejectPayment(id: string) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new HttpException('Invalid payment Id', HttpStatus.NOT_FOUND);
    }
    payment.status = Status.REJECTED;

    return this.paymentRepository.save(payment);
  }

  async remove(userId: string, id: string) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new HttpException('Invalid Payment Id', HttpStatus.NOT_FOUND);
    }
    if (payment.userId != userId) {
      throw new HttpException(
        'A payment can be only remove by user who made it.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.paymentRepository.delete({ id });
    return payment;
  }
}
