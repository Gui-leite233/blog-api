import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.schema.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}