import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './dto/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(req: CreateUserDto): Promise<User> {
    const checkUser: User = await this.userRepository.findOne({
      where: { email: req.email },
    });
    if (checkUser) {
      throw new HttpException('Already registered', HttpStatus.BAD_REQUEST);
    }
    const user: Partial<User> = {
      id: uuid(),
      email: req.email,
      name: req.name,
      password: req.password,
      role: req.role,
    };
    const payload = { sub: user.id, email: user.email, role: user.role };
    user.accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: UserRole.CONSUMER },
    });
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async login(req: LoginUserDto) {
    const user: User = await this.userRepository.findOne({
      where: { email: req.email, password: req.password },
    });

    if (!user) {
      throw new HttpException(
        'Incorrect Email or Password.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    user.accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    return await this.userRepository.save(user);
  }

  async remove(id: string) {
    const user: User = await this.userRepository.findOne({ where: { id } });
    await this.userRepository.delete({ id });

    return user;
  }
}
