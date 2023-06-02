import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SuperAdminController } from '../../controllers/super-admin/super-admin.controller';
import { SuperAdminService } from '../../services/super-admin/super-admin.service';
import { SuperAdmin } from '../../../db/entities/super_admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SuperAdmin])],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}
