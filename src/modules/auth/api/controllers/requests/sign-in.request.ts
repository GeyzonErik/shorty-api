import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @ApiProperty({
    example: 'Leonardo@mail.com',
    description: 'The email address of the user. Must be a valid email format.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'P455w0rd1',
    description:
      'The password for the user account. Must include at least one uppercase letter, one lowercase letter, and a number.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
