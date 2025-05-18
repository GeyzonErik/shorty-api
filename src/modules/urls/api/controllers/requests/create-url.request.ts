import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateUrlRequest {
  @ApiProperty({
    description: 'The original URL to be shortened.',
    example: 'https://example.com',
  })
  @IsString()
  @IsUrl()
  originalUrl: string;
}
