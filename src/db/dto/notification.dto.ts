import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsString, IsIn } from 'class-validator';
import { Any } from 'typeorm';

export class NotificationDto {
  @ApiProperty({
    type: String,
    description: 'Notification Title',
    default: '',
  })
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    type: String,
    description: 'Notification Message',
    default: '',
  })
  @IsNotEmpty()
  readonly message: string;

  @ApiProperty({
    type: Any,
    description: 'Any additional data to send',
    default: '',
  })
  @IsOptional()
  readonly data: any;

  @ApiProperty({
    type: String,
    description: 'List of Device Ids to receive this notification',
    default: '',
  })
  @IsOptional()
  readonly player_ids: string[];

  @ApiProperty({
    type: String,
    description: 'List of Device Ids to receive this notification',
    default: '',
  })
  @IsOptional()
  readonly actions: PushActions[];

  @ApiProperty({
    type: String,
    description: 'Notification Type (`rider` OR `driver`)',
    default: '',
  })
  @IsString()
  @IsIn(['rider', 'driver'])
  @IsOptional()
  readonly type: string;
}

interface PushActions {
  id: string;
  text: string;
  icon: string;
}
