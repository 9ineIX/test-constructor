import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Mathematics', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Math and algebra tests', description: 'Category description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
