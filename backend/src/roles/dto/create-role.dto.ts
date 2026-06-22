import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'TEACHER', description: 'Role name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Role name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Role name cannot exceed 50 characters' })
  @Matches(/^[A-Z_]+$/, { message: 'Role name must contain only uppercase letters and underscores' })
  name: string;
}
