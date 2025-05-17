import { IsSecurePassword } from '@/auth/domain/validators/is-secure-password.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpRequest {
  @ApiProperty({
    description: 'The name of the user.',
    example: 'Barry Allen',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'Leonardo@mail.com',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'The password for the user account. Must contain at least one uppercase letter, one lowercase letter, and one number.',
    example: 'P455w0rd1',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  @IsSecurePassword()
  password: string;
}
