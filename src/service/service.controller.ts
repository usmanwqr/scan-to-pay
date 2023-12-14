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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UserGuard } from 'src/user/user.guard';
import { UserRole } from 'src/user/dto/user.enum';
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @UseGuards(UserGuard)
  @Post()
  create(@Request() req, @Body() createServiceDto: CreateServiceDto) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.serviceService.create(createServiceDto);
  }

  @UseGuards(UserGuard)
  @Get()
  findAll(@Request() req) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.serviceService.findAll();
  }

  @UseGuards(UserGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.serviceService.findOne(id);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.serviceService.update(id, updateServiceDto);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.serviceService.remove(id);
  }
}
