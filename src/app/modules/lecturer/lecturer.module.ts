import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LecturersController } from '../../controllers/lecturer/lecturer.controller';

import { LecturersService } from '../../services/lecturer/lecturer.service';

import { Lecturer as LecturerEntity } from '../../../db/entities/lecturer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LecturerEntity])],
  controllers: [LecturersController],
  providers: [LecturersService],
  exports: [TypeOrmModule.forFeature([LecturerEntity]), LecturersService],
})
export class LecturersModule {}
