import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { UserGuard } from 'src/user/user.guard';
import { UserRole } from 'src/user/dto/user.enum';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(UserGuard)
  @Post()
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.bookingService.create(req.user.sub, createBookingDto);
  }

  @UseGuards(UserGuard)
  @Get()
  findAll(@Request() req) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.bookingService.findAll(req.user.sub);
  }

  @UseGuards(UserGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.bookingService.update(id, updateBookingDto);
  }

  @UseGuards(UserGuard)
  @Patch('/confirm-booking/:id')
  confirmBooking(@Request() req, @Param('id') id: string) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.bookingService.confirmBooking(req.user.sub, id);
  }

  @UseGuards(UserGuard)
  @Patch('/reject-booking/:id')
  rejectBooking(@Request() req, @Param('id') id: string) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.bookingService.rejectBooking(req.user.sub, id);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.bookingService.remove(id);
  }
}
