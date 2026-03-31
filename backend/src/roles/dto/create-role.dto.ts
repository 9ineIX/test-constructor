import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'TEACHER', description: 'Role name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
