import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateSuperAdminDto {
  @ApiProperty({
    type: String,
    description: 'Email of Super Admin',
    default: '',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'Password of Super Admin',
    default: '',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UpdateSuperAdminDto extends PartialType(CreateSuperAdminDto) {}
