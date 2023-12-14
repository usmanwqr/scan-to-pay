import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
