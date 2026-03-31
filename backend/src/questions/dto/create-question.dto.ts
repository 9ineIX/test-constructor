import { IsString, IsNotEmpty, IsNumber, IsArray, IsUUID, IsBoolean, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ example: 'What is 2+2?', description: 'Question text' })
  @IsString()
  @IsNotEmpty()
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
  options: { text: string; isCorrect: boolean }[];
}
