import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StudentsController } from '../../controllers/student/student.controller';

import { StudentsService } from '../../services/student/student.service';

import { Student as StudentEntity } from '../../../db/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [TypeOrmModule.forFeature([StudentEntity]), StudentsService],
})
export class StudentsModule {}
