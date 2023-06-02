import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindIdDto {
  @ApiProperty({
    type: Number,
    description: 'The record `id`',
    default: 1,
  })
  @IsNumberString()
  readonly id: number;
}
