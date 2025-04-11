import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthorDocument = HydratedDocument<Author>;

@Schema()
export class Author {
  @Prop({ required: true })
  name: string;

  @Prop()
  biography?: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  nationality?: string;

  @Prop()
  website?: string;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);