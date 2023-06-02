import { IsOptional, IsString, IsBoolean } from 'class-validator';

import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCoursesDto {
  @ApiProperty({
    type: String,
    description: 'Course name',
    default: '',
  })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({
    type: Boolean,
    description: 'Course Registered',
    default: '',
  })
  @IsBoolean()
  readonly registered: boolean;
}

export class UpdateCoursesDto extends PartialType(CreateCoursesDto) {}
