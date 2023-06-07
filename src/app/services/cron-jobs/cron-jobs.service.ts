import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';

import { EventEmitter2 } from '@nestjs/event-emitter';
import ISuperAdmin from '../../../db/types/super_admin.interface';
import { CreateAdminDto } from '../../../db/dto/admin.dto';

@Injectable()
export class CronJobsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Timeout(5000)
  async handleTimeout() {
    this.eventEmitter.emit('admin.create', {
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
      first_name: process.env.DEFAULT_ADMIN_FIRST_NAME,
      last_name: process.env.DEFAULT_ADMIN_LAST_NAME,
      phone: process.env.DEFAULT_ADMIN_PHONE,
      permissions: 'SUPER ADMIN',
      account_type: 'ADMIN',
    } as unknown as CreateAdminDto);

    Logger.log('Application Started Successfully');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async dailyTask() {
    Logger.log('Runs everyday at midnight');
  }

  @Cron(CronExpression.EVERY_WEEK)
  weeklyTask() {
    Logger.log('Generated Weekly Sales Report');
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  monthlyTask() {
    Logger.log('Generated Monthly Sales Report');
  }
}
