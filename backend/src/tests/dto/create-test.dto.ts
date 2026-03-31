import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestDto {
  @ApiProperty({ example: 'Math Test', description: 'Test title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'Basic mathematics test', description: 'Test description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: ['uuid1', 'uuid2'], description: 'Category IDs', required: false })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  categoryIds?: string[];
}
