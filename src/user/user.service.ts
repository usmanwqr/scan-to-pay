import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './dto/user.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { encryptPassword, decryptPassword } from './user.utility';

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

    const password = await encryptPassword(req.password);

    const user: Partial<User> = {
      id: uuid(),
      email: req.email,
      name: req.name,
      password: password,
      role: req.role,
    };
    const payload = { sub: user.id, email: user.email, role: user.role };
    user.accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });
    const res = await this.userRepository.save(user);
    delete res.password;

    return res;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'accessToken'],
      where: { role: UserRole.CONSUMER },
    });
  }

  async findOne(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('Invalid User Id', HttpStatus.NOT_FOUND);
    }
    delete user.password;
    return user;
  }

  async login(req: LoginUserDto) {
    const user: User = await this.userRepository.findOne({
      where: { email: req.email },
    });

    if (!user) {
      throw new HttpException('Incorrect Email.', HttpStatus.UNAUTHORIZED);
    }

    const ismatch = await decryptPassword(user.password, req.password);
    if (!ismatch) {
      throw new HttpException('Incorrect Password.', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    user.accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '3d',
    });

    const res = await this.userRepository.save(user);
    delete res.password;

    return res;
  }

  async update(id: string, req: UpdateUserDto) {
    const user: User = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('Invalid User Id', HttpStatus.NOT_FOUND);
    }
    user.name = req.name ? req.name : user.name;
    user.email = req.email ? req.email : user.email;
    if (req.password) {
      user.password = req.password;
    }
    const res = await this.userRepository.save(user);

    delete res.password;
    return res;
  }

  async remove(id: string) {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Invalid User Id', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete({ id });

    return user;
  }
}
