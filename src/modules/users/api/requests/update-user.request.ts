import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty({
    example: 'Frank Abagnale Jr',
    description: 'The name of the user.',
  })
  @IsString()
  name: string;
}
