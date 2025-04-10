import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  description?: string;

  @Prop()
  publishedDate?: Date;

  @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Category'}]})
  categories: Category[];
}

export const BookSchema = SchemaFactory.createForClass(Book);