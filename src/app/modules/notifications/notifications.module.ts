import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NotificationsController } from './../../controllers/notifications/notifications.controller';
import { PushNotificationsService } from './../../services/push-notifications/push-notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [PushNotificationsService],
  imports: [HttpModule],
})
export class NotificationsModule {}
