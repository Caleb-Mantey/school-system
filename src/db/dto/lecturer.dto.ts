import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';

import { UserDto } from './shared/user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateLecturerDto extends UserDto {}

export class UpdateLecturerDto extends PartialType(CreateLecturerDto) {}
