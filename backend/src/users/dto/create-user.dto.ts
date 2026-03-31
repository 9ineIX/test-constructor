import { IsEmail, IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
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

  @ApiProperty({ example: 'uuid-of-role', description: 'Role ID' })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;
}
