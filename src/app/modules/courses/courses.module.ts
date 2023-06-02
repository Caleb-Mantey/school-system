import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CoursesController } from '../../controllers/courses/courses.controller';

import { CoursesService } from '../../services/courses/courses.service';

import { Course as CoursesEntity } from '../../../db/entities/courses.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoursesEntity])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [TypeOrmModule.forFeature([CoursesEntity]), CoursesService],
})
export class CoursesModule {}
