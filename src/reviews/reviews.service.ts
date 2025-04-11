// src/reviews/reviews.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { BooksService } from '../books/books.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private booksService: BooksService,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    await this.booksService.findOne(createReviewDto.bookId);

    const existingReview = await this.reviewModel.findOne({
      user: userId,
      book: createReviewDto.bookId,
    }).exec();

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this book');
    }

    const newReview = new this.reviewModel({
      user: userId,
      book: createReviewDto.bookId,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
    });

    return newReview.save();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find()
      .populate('user', '-password')
      .populate('book')
      .exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id)
      .populate('user', '-password')
      .populate('book')
      .exec();
      
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    return review;  
  }

  async findOneOrFail(id: string): Promise<Review> {  
    const review = await this.reviewModel.findById(id);  
    if (!review) {  
      throw new NotFoundException('Review not found');  
    }  
    return review;  
  }  
  

  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    if (review.user.toString() !== userId) {
      throw new BadRequestException('You can only edit your own reviews');
    }
    
    if (updateReviewDto.bookId) {
      await this.booksService.findOne(updateReviewDto.bookId);
    }
    
    const updatedReview = await this.reviewModel
      .findByIdAndUpdate(
        id, 
        {
          rating: updateReviewDto.rating,
          comment: updateReviewDto.comment,
          book: updateReviewDto.bookId || review.book,
        },
        { new: true }
      )
      .populate('user', '-password')
      .populate('book')
      .exec();
    
    return review;
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findById(id).exec();
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    
    if (review.user.toString() !== userId && !(await this.isAdmin(userId))) {
      throw new BadRequestException('You can only delete your own reviews');
    }
    
    const result = await this.reviewModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }

  async findByBook(bookId: string): Promise<Review[]> {
    return this.reviewModel.find({ book: bookId })
      .populate('user', '-password')
      .exec();
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.reviewModel.find({ user: userId })
      .populate('book')
      .exec();
  }

  async getBookAverageRating(bookId: string): Promise<number> {
    const result = await this.reviewModel.aggregate([
      { $match: { book: bookId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]).exec();
    
    if (result.length === 0) {
      return 0;
    }
    
    return result[0].avgRating;
  }

  private async isAdmin(userId: string): Promise<boolean> {
    return false;
  }
}