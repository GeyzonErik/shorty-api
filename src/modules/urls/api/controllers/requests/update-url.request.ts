import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class UpdateUrlRequest {
  @ApiProperty({
    description: 'The original URL to be shortened.',
    example: 'https://example.com',
  })
  @IsString()
  @IsUrl()
  orginalUrl: string;
}
