import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, lastValueFrom } from 'rxjs';
import { NotificationDto } from '../../../db/dto/notification.dto';

@Injectable()
export class PushNotificationsService {
  constructor(private httpService: HttpService) {}

  onesignalConfigs = {
    rider: {
      app_id: process.env.ONESIGNAL_RIDER_APP_ID,
      api_key: process.env.ONESIGNAL_RIDER_REST_API_KEY,
      notification_channel:
        process.env.ONESIGNAL_RIDER_ANDROID_NOTIFICATION_CHANNEL,
    },
    driver: {
      app_id: process.env.ONESIGNAL_DRIVER_APP_ID,
      api_key: process.env.ONESIGNAL_DRIVER_REST_API_KEY,
      notification_channel:
        process.env.ONESIGNAL_DRIVER_ANDROID_NOTIFICATION_CHANNEL,
    },
  };

  async notifyAllDevices(options: NotificationDto) {
    await lastValueFrom(this.notifyAllDrivers(options));
    await lastValueFrom(this.notifyAllRiders(options));
  }

  notifyDevice(options: NotificationDto): Observable<AxiosResponse> {
    return this.httpService.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: this.onesignalConfigs[options.type].app_id,
        contents: { en: options.message },
        headings: { en: options.title },
        include_player_ids: options.player_ids,
        content_available: true,
        large_icon: 'ic_onesignal_large_icon_default',
        android_channel_id:
          this.onesignalConfigs[options.type].notification_channel,
        ios_sound: 'notification.mp3',
        android_sound: 'notification.mp3',
        buttons: [...options.actions],
        data: {
          PushTitle: options.title,
          others: options.data,
        },
      },
      {
        headers: {
          Accept: 'application/json',
          // Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  notifyAllRiders(options: NotificationDto): Observable<AxiosResponse> {
    return this.httpService.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: this.onesignalConfigs.rider.app_id,
        contents: { en: options.message },
        headings: { en: options.title },
        // included_segments: ['Riders'],
        content_available: true,
        large_icon: 'ic_onesignal_large_icon_default',
        android_channel_id: this.onesignalConfigs.rider.notification_channel,
        ios_sound: 'notification.mp3',
        android_sound: 'notification.mp3',
        data: {
          PushTitle: options.title,
          others: options.data,
        },
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${this.onesignalConfigs.rider.api_key}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  notifyAllDrivers(options: NotificationDto): Observable<AxiosResponse> {
    return this.httpService.post(
      'https://onesignal.com/api/v1/notifications',
      {
        app_id: this.onesignalConfigs.driver.app_id,
        contents: { en: options.message },
        headings: { en: options.title },
        // included_segments: ['Drivers'],
        content_available: true,
        large_icon: 'ic_onesignal_large_icon_default',
        android_channel_id: this.onesignalConfigs.driver.notification_channel,
        ios_sound: 'notification.mp3',
        android_sound: 'notification.mp3',
        data: {
          PushTitle: options.title,
          others: options.data,
        },
      },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${this.onesignalConfigs.driver.api_key}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
