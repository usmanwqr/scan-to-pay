import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
  ) {}
  async create(userId: string, req: CreateCardDto) {
    const checkCard: Card = await this.cardRepository.findOne({
      where: { number: req.number },
    });
    if (checkCard) {
      throw new HttpException('Card already added', HttpStatus.BAD_REQUEST);
    }

    const [month, year] = req.expiryDate.split('/');
    const convertedDate = new Date(Number(`20${year}`), Number(month) - 1, 1);

    const card: Partial<Card> = {
      id: uuid(),
      name: req.name,
      number: req.number,
      cvv: req.cvv,
      expiryDate: convertedDate,
      userId: userId,
    };
    return this.cardRepository.save(card);
  }

  findAll(userId: string) {
    return this.cardRepository.find({ where: { userId: userId } });
  }

  findOne(id: string) {
    return this.cardRepository.findOne({ where: { id } });
  }

  async update(id: string, req: UpdateCardDto) {
    const card: Card = await this.cardRepository.findOne({ where: { id } });
    card.name = req.name ? req.name : card.name;
    card.number = req.number ? req.number : card.number;
    card.cvv = req.cvv ? req.cvv : card.cvv;

    if (req.expiryDate) {
      const [month, year] = req.expiryDate.split('/');
      const convertedDate = new Date(Number(`20${year}`), Number(month) - 1, 1);
      card.expiryDate = convertedDate;
    }

    return this.cardRepository.save(card);
  }

  async remove(id: string) {
    const card: Card = await this.cardRepository.findOne({ where: { id } });
    this.cardRepository.delete({ id });
    return card;
  }
}
