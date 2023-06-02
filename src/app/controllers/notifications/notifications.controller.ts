import { Body, Controller, Get, Param, Post, Logger } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiSecurity,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { lastValueFrom } from 'rxjs';

import { PushNotificationsService } from '../../services/push-notifications/push-notifications.service';
import { NotificationDto } from '../../../db/dto/notification.dto';

@ApiTags('Notifications')
@ApiSecurity('api-key')
@ApiBearerAuth('access-token')
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: PushNotificationsService) {}

  @Post('/all')
  @ApiOkResponse({ description: 'Sends a push notification to all devices' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async all(@Body() notificationDto: NotificationDto) {
    try {
      await this.notificationService.notifyAllDevices(notificationDto);

      return { status: 'success', message: 'Notification Sent to All Devices' };
    } catch (error) {
      Logger.log(error);
      Logger.log(error.response);
    }
  }

  @Post('/device')
  @ApiOkResponse({
    description: 'Sends a push notification to a specific device',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async device(@Body() notificationDto: NotificationDto) {
    try {
      await lastValueFrom(
        this.notificationService.notifyDevice(notificationDto),
      );

      return {
        status: 'success',
        message: `Notification Sent to the following devices ${notificationDto.player_ids}`,
      };
    } catch (error) {
      Logger.log(error.response);
    }
  }

  @Post('/lecturers')
  @ApiOkResponse({
    description: 'Sends a push notification to all lecturers',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async lecturers(@Body() notificationDto: NotificationDto) {
    try {
      this.notificationService.notifyAllDrivers(notificationDto);

      return {
        status: 'success',
        message: `Notification Sent to all lecturers`,
      };
    } catch (error) {
      Logger.log(error.response);
    }
  }

  @Post('/students')
  @ApiOkResponse({
    description: 'Sends a push notification to all students',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async students(@Body() notificationDto: NotificationDto) {
    try {
      this.notificationService.notifyAllRiders(notificationDto);

      return {
        status: 'success',
        message: `Notification Sent to all students`,
      };
    } catch (error) {
      Logger.log(error.response);
    }
  }
}
