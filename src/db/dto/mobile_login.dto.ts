import { IsPhoneNumber, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class MobileLoginDto {
  @ApiProperty({
    type: String,
    description: 'Phone Number',
    default: '',
  })
  @IsPhoneNumber('GH')
  readonly phone: string;

  @ApiProperty({
    type: String,
    description: 'User Account Type [Rider, Driver]',
    default: '',
  })
  @IsNotEmpty()
  readonly type: string;
}
