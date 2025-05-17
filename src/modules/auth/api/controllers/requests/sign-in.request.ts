import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @ApiProperty({ name: 'email', type: 'string', example: 'example@mail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ name: 'password', type: 'string', example: 'Ab25@r' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
