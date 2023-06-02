import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export abstract class UserDto {
  @ApiProperty({
    type: String,
    description: 'First Name',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({
    type: String,
    description: 'Last Name',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({
    type: String,
    description: 'Name',
    default: '',
  })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({
    type: String,
    description: 'Email Address',
    default: '',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'User password',
    default: '',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    type: Boolean,
    description: 'Allow Push Notification `Alowed Values =>(true, false)`',
    default: 'false',
  })
  @IsOptional()
  @IsBoolean()
  push: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Allow Email Notification `Alowed Values =>(true, false)`',
    default: 'false',
  })
  @IsOptional()
  @IsBoolean()
  email_notification: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Allow SMS Notification `Alowed Values =>(true, false)`',
    default: 'false',
  })
  @IsOptional()
  @IsBoolean()
  sms: boolean;

  @ApiProperty({
    type: String,
    description: 'Phone Number',
    default: '',
  })
  @IsPhoneNumber('GH')
  phone: string;

  @ApiProperty({
    type: String,
    description: 'Account Type',
    default: '',
  })
  @IsString()
  @IsOptional()
  readonly account_type: string;
}
