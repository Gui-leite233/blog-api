import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book, BookDocument } from './schemas/book.schema';
import { ReviewsService } from '../reviews/reviews.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private reviewsService: ReviewsService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = new this.bookModel(createBookDto);
    return newBook.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find()
      .populate('author')
      .populate('categories')
      .exec();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id)
      .populate('author')
      .populate('categories')
      .exec();
      
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const updatedBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .populate('author')
      .populate('categories')
      .exec();
    
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    
    return updatedBook;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  async findByCategory(categoryId: string): Promise<Book[]> {
    return this.bookModel.find({ categories: categoryId })
      .populate('author')
      .populate('categories')
      .exec();
  }

  async findByAuthor(authorId: string): Promise<Book[]> {
    return this.bookModel.find({ author: authorId })
      .populate('categories')
      .exec();
  }

  async updateBookRating(bookId: string): Promise<void> {
    const averageRating = await this.reviewsService.getBookAverageRating(bookId);
    await this.bookModel.findByIdAndUpdate(bookId, { averageRating }).exec();
  }
}