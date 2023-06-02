import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class OtpDto {
  @ApiProperty({
    type: String,
    description: 'Otp Code',
    default: '',
  })
  @IsNotEmpty()
  readonly otp_code: string;

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
