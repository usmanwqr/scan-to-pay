import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { v4 as uuid } from 'uuid';
@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  async create(userId: string, req: CreateReviewDto) {
    const checkReview = await this.reviewRepository.findOne({
      where: { userId: userId, merchantId: req.merchantId },
    });
    if (checkReview) {
      throw new HttpException(
        "You've already given review to this merchant",
        HttpStatus.BAD_REQUEST,
      );
    }

    const review: Partial<Review> = {
      id: uuid(),
      rating: req.rating,
      review: req.review,
      merchantId: req.merchantId,
      userId: userId,
    };
    return this.reviewRepository.save(review);
  }

  findAllUserReviews(userId: string) {
    return this.reviewRepository.find({ where: { userId } });
  }

  findAllMerchantReviews(merchantId: string) {
    return this.reviewRepository.find({ where: { merchantId } });
  }

  findOne(id: string) {
    return this.reviewRepository.findOne({ where: { id } });
  }

  async update(id: string, userId: string, req: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review) {
      throw new HttpException('Invalid Review Id', HttpStatus.NOT_FOUND);
    }
    if (review.userId != userId) {
      throw new HttpException(
        'A consumer can only update review given by himself.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    review.review = req.review ? req.review : review.review;
    review.rating = req.rating ? req.rating : review.rating;
    return this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new HttpException('Invalid Review Id', HttpStatus.NOT_FOUND);
    }
    this.reviewRepository.delete({ id });

    return review;
  }
}
