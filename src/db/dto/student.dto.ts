import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';

import { UserDto } from './shared/user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateStudentDto extends UserDto {}

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
