import { IsEmail, IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'STUDENT', description: 'User role', required: false })
  @IsString()
  @IsOptional()
  @IsIn(['STUDENT', 'TEACHER', 'ADMIN'])
  roleName?: string;
}
