import { Global, Module } from '@nestjs/common';
import { SlackModule } from 'nestjs-slack';
import { SlackLogService } from '../../services/slack-log/slack-log.service';

@Global()
@Module({
  imports: [
    SlackModule.forRoot({
      type: 'webhook',
      channels: [
        {
          name: 'errors',
          url: 'https://hooks.slack.com/services/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',
        },
        {
          name: 'failed_bookings',
          url: 'https://hooks.slack.com/services/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',
        },
        {
          name: 'otps',
          url: 'https://hooks.slack.com/services/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',
        },
        {
          name: 'dropin_development',
          url: 'https://hooks.slack.com/services/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',
        },
      ],
    }),
  ],
  providers: [SlackLogService],
  exports: [SlackModule],
})
export class RealtimeLogModule {}
