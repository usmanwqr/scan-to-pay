import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  review: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => User, (merchant) => merchant.mReviews)
  merchant: User;

  @Column()
  merchantId: string;
}
