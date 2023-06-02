import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { SlackService } from 'nestjs-slack';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { HubtelSmsService } from './hubtel_sms.service';

@Injectable()
export class SmsService {
  constructor(
    private hubtelSmsService: HubtelSmsService,
    private readonly slackService: SlackService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async send_sms(number: string, message: string) {
    try {
      const response = await lastValueFrom(
        this.hubtelSmsService.send(number, message),
      );

      Logger.log(response.data);
      return response.data;
    } catch (error) {
      const slackResponse = `SMS (SmsService) \n  ${error}`;

      this.slackService.sendText(slackResponse, { channel: 'errors' });
      this.eventEmitter.emit('send.telegram', slackResponse);

      Logger.log(error.response.data);
    }
  }

  @OnEvent('send.sms')
  async perform_sms(payload: any) {
    try {
      await this.send_sms(payload.number, payload.message);
    } catch (error) {
      Logger.log(error);
    }
  }
}
