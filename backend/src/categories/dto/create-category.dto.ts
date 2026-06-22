import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Mathematics', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Category name must be at least 2 characters long' })
  @MaxLength(100)
  @Matches(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-]+$/, { message: 'Category name can only contain letters, numbers, spaces and hyphens' })
  name: string;

  @ApiProperty({ example: 'Math and algebra tests', description: 'Category description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
