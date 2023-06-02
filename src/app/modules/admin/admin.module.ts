import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminController } from '../../controllers/admin/admin.controller';

import { AdminService } from '../../services/admin/admin.service';

import { Admin as AdminEntity } from '../../../db/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
