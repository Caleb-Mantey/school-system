import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { SmsController } from '../../controllers/sms/sms.controller';

import { SmsService } from '../../services/sms/sms.service';
import { HubtelSmsService } from '../../services/sms/hubtel_sms.service';

@Module({
  imports: [HttpModule],
  controllers: [SmsController],
  providers: [SmsService, HubtelSmsService],
})
export class SmsModule {}
