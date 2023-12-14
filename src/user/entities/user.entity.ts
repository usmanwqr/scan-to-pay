import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../dto/user.enum';
import { IsEmail, IsEnum, Length } from 'class-validator';
import { Card } from 'src/card/entities/card.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Length(2, 8)
  password: string;

  @Column()
  @IsEnum(UserRole)
  role: UserRole;

  @Column()
  accessToken: string;

  @OneToMany(() => Card, (cards) => cards.user)
  cards: Card[];
}
