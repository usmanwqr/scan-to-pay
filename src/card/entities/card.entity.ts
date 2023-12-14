import { Payment } from 'src/payment/entities/payment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  number: string;

  @Column()
  cvv: number;

  @Column()
  expiryDate: Date;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Payment, (payments) => payments.card, { nullable: true })
  payments: Payment[];
}
