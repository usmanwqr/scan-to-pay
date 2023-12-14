import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
  ) {}
  async create(req: CreateServiceDto) {
    const checkService: Service = await this.serviceRepository.findOne({
      where: { name: req.name },
    });
    if (checkService) {
      throw new HttpException('Service already added', HttpStatus.BAD_REQUEST);
    }
    const service: Partial<Service> = {
      id: uuid(),
      name: req.name,
      price: req.price,
    };
    return this.serviceRepository.save(service);
  }

  findAll() {
    return this.serviceRepository.find();
  }

  findOne(id: string) {
    return this.serviceRepository.findOne({ where: { id } });
  }

  async update(id: string, req: UpdateServiceDto) {
    const service: Service = await this.serviceRepository.findOne({
      where: { id },
    });
    service.name = req.name ? req.name : service.name;
    service.price = req.price ? req.price : service.price;

    return this.serviceRepository.save(service);
  }

  async remove(id: string) {
    const service: Service = await this.serviceRepository.findOne({
      where: { id },
    });
    this.serviceRepository.delete({ id });
    return service;
  }
}
