import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';

import { UserDto } from './shared/user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateAdminDto extends UserDto {
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
  password: string;

  @ApiProperty({
    type: String,
    description: 'Phone Number',
    default: '',
  })
  @IsPhoneNumber('GH')
  phone: string;

  @ApiProperty({
    type: String,
    description: 'Admin privileges and permissions',
    default: '',
  })
  @IsString()
  readonly permissions: string;
}

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
