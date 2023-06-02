import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class PhoneDto {
  @ApiProperty({
    type: String,
    description: 'Phone Number',
    default: '',
  })
  @IsPhoneNumber('GH')
  readonly phone: string;
}
