import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ToggleUrlStatusRequest {
  @ApiProperty({
    description: 'Whether the URL is active or not',
    example: false,
  })
  @IsBoolean()
  active: boolean;
}
