import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({
    type: String,
    description: 'Email Address',
    default: '',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    default: '',
  })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
