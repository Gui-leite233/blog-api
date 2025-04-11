import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';
import { Author } from '../../authors/schemas/author.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author', required: true })
  author: Author;

  @Prop()
  description?: string;

  @Prop()
  publishedDate?: Date;
  
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
  categories: Category[];

  @Prop({ default: 0 })
  averageRating: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);