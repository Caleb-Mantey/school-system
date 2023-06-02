import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SlackService } from 'nestjs-slack';

@Injectable()
export class SlackLogService {
  constructor(private readonly slackService: SlackService) {}

  @OnEvent('send.slack')
  sendSlackLogs(message) {
    this.slackService.sendText(message, { channel: 'dropin_development' });
  }

  @OnEvent('send.slack.errors')
  sendSlackErrors(message) {
    this.slackService.sendText(message, { channel: 'errors' });
  }
}
