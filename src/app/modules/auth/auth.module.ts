import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { AppCacheModule } from '../../cache/app.cache.module';
import { AdminModule } from '../admin/admin.module';

import { AuthController } from '../../controllers/auth/auth.controller';

import { AuthService } from '../../services/auth/auth.service';

import { JwtStrategy } from '../../strategy/jwt.strategy';

import { RefreshToken } from '../../../db/entities/refresh_token.entity';
import { StudentsService } from './../../services/student/student.service';
import { LecturersService } from './../../services/lecturer/lecturer.service';
import { SlackService } from 'nestjs-slack';
import { AppCacheService } from './../../cache/app.cache.service';
import { AdminService } from './../../services/admin/admin.service';

import { Lecturer } from './../../../db/entities/lecturer.entity';
import { Student } from './../../../db/entities/student.entity';
import { Admin } from './../../../db/entities/admin.entity';

@Module({
  imports: [
    HttpModule,
    AdminModule,
    AppCacheModule,
    TypeOrmModule.forFeature([RefreshToken, Lecturer, Student, Admin]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LecturersService,
    StudentsService,
    AdminService,
    AppCacheService,
    SlackService,
    JwtStrategy,
  ],
})
export class AuthModule {}
