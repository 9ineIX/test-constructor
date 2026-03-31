import { IsUUID, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResultDto {
  @ApiProperty({ example: 'uuid-of-test', description: 'Test ID' })
  @IsUUID()
  @IsNotEmpty()
  testId: string;

  @ApiProperty({ 
    example: '{"questionId1": "optionId1", "questionId2": ["optionId2", "optionId3"]}', 
    description: 'User answers as JSON object' 
  })
  @IsObject()
  @IsNotEmpty()
  answers: any;
}
