import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { UserGuard } from 'src/user/user.guard';
import { UserRole } from './dto/user.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/merchant-register')
  async merchantRegister(@Body() createUserDto: CreateUserDto) {
    createUserDto.role = UserRole.MERCHANT;
    return await this.userService.create(createUserDto);
  }

  @UseGuards(UserGuard)
  @Post('/consumer-register')
  async consumerRegister(@Request() req, @Body() createUserDto: CreateUserDto) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    createUserDto.role = UserRole.CONSUMER;
    return await this.userService.create(createUserDto);
  }

  @UseGuards(UserGuard)
  @Get()
  async findAll(@Request() req) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return await this.userService.findAll();
  }

  @UseGuards(UserGuard)
  @Get('/profile')
  async findOne(@Request() req) {
    return await this.userService.findOne(req.user.sub);
  }

  @Post('/login')
  async login(@Body() req: LoginUserDto) {
    return await this.userService.login(req);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    if (req.user.role == UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return await this.userService.remove(id);
  }
}
