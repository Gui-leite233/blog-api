import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { NotFoundException } from '@nestjs/common';

export interface Book {
    id: number;
    title: string;
    author: string;
    description?: string;
    publishedDate?: Date;
  }

@Injectable()
export class BooksService {
    private books: Book[] = [];
  private idCounter = 1;

  create(createBookDto: CreateBookDto): Book {
    const newBook: Book = { id: this.idCounter++, ...createBookDto };
    this.books.push(newBook);
    return newBook;
  }

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book {
    const book = this.books.find(b => b.id === id);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return book;
  }

  update(id: number, updateBookDto: UpdateBookDto): Book {
    const book = this.findOne(id);
    Object.assign(book, updateBookDto);
    return book;
  }

  remove(id: number): void {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) throw new NotFoundException(`Book with id ${id} not found`);
    this.books.splice(index, 1);
  }
}
