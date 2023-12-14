import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { UserGuard } from 'src/user/user.guard';
import { UserRole } from 'src/user/dto/user.enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(UserGuard)
  @Post()
  create(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(req.user.sub, createPaymentDto);
  }

  @UseGuards(UserGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.paymentService.findOne(req.user.sub, id);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(req.user.sub, id, updatePaymentDto);
  }

  @UseGuards(UserGuard)
  @Patch('/confirm-payment/:id')
  confirmPayment(@Request() req, @Param('id') id: string) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.paymentService.confirmPayment(id);
  }

  @UseGuards(UserGuard)
  @Patch('/reject-payment/:id')
  rejectPayment(@Request() req, @Param('id') id: string) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.paymentService.rejectPayment(id);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.paymentService.remove(req.user.sub, id);
  }
}
