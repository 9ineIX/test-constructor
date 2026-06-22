import { IsString, IsNotEmpty, IsNumber, IsArray, IsUUID, IsBoolean, Max, Min, MinLength, MaxLength, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: 'What is 2+2?', description: 'Question text' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Question text must be at least 5 characters long' })
  @MaxLength(1000, { message: 'Question text cannot exceed 1000 characters' })
  text: string;

  @ApiProperty({ example: 1, description: 'Question order in test' })
  @IsNumber()
  @Min(1)
  @Max(10)
  order: number;

  @ApiProperty({ example: 'uuid-of-test', description: 'Test ID' })
  @IsUUID()
  @IsNotEmpty()
  testId: string;

  @ApiProperty({ example: 'uuid-of-question-type', description: 'Question type ID' })
  @IsUUID()
  @IsNotEmpty()
  typeId: string;

  @ApiProperty({ 
    example: [
      { text: '3', isCorrect: false },
      { text: '4', isCorrect: true },
      { text: '5', isCorrect: false },
      { text: '6', isCorrect: false }
    ], 
    description: 'Question options' 
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Question must have at least 2 options' })
  @ArrayMaxSize(4, { message: 'Question cannot have more than 4 options' })
  options: { text: string; isCorrect: boolean }[];
}
