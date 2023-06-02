import { Module } from '@nestjs/common';

import { CronJobsService } from '../../services/cron-jobs/cron-jobs.service';

@Module({
  providers: [CronJobsService],
})
export class CronJobsModule {}
