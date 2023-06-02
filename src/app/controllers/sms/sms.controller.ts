import { Body, Controller, Param, Logger, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiSecurity,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SmsService } from '../../services/sms/sms.service';

@ApiTags('Sms')
@ApiSecurity('api-key')
@ApiBearerAuth('access-token')
@Controller('sms')
export class SmsController {
  constructor(
    private readonly smsService: SmsService, // private readonly appSettingsService: AppSettingsService,
  ) {}

  @Post('send')
  @ApiOkResponse({
    description: 'Send Sms',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in post params',
  })
  send(@Body() body) {
    Logger.log(body);
    this.smsService.send_sms(body.phone, body.message);
  }
}
