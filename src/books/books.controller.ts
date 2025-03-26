import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { BooksService, Book } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto): Book {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(): Book[] {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Book {
    return this.booksService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Book {
    return this.booksService.update(Number(id), updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): void {
    this.booksService.remove(Number(id));
  }
}
