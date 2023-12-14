import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserGuard } from 'src/user/user.guard';
import { UserRole } from 'src/user/dto/user.enum';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(UserGuard)
  @Post()
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    if (req.user.role != UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.reviewService.create(req.user.sub, createReviewDto);
  }

  @UseGuards(UserGuard)
  @Get('user-reviews')
  findAllUserReviews(@Request() req) {
    return this.reviewService.findAllUserReviews(req.user.sub);
  }

  @UseGuards(UserGuard)
  @Get('merchant-reviews')
  findAllMerchantReviews(@Request() req) {
    return this.reviewService.findAllMerchantReviews(req.user.sub);
  }

  @UseGuards(UserGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    if (req.user.role != UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.reviewService.update(id, req.user.sub, updateReviewDto);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    if (req.user.role != UserRole.CONSUMER) {
      throw new UnauthorizedException();
    }
    return this.reviewService.remove(id);
  }
}
