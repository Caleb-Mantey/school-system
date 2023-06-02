import { Module, CacheModule, Logger } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

import AdminJS from 'adminjs';
import { AdminModule as AdminJsModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import { validate } from 'class-validator';

import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import { join } from 'path';

import { AppController } from '../controllers/app.controller';

import { AppService } from '../services/app.service';
import { AppCacheService } from '../cache/app.cache.service';
import { PushNotificationsService } from './../services/push-notifications/push-notifications.service';

import { LecturersModule } from './lecturer/lecturer.module';
import { StudentsModule } from './student/student.module';
import { CoursesModule } from './courses/courses.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SuperAdminModule } from './super-admin/super-admin.module';
import { RealtimeLogModule } from './realtime-log/realtime-log.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SmsModule } from './sms/sms.module';

import { SuperAdmin } from '../../db/entities/super_admin.entity';
import { Admin } from '../../db/entities/admin.entity';
import { Lecturer } from '../../db/entities/lecturer.entity';
import { Student } from '../../db/entities/student.entity';
import { Course } from '../../db/entities/courses.entity';
import { ApiAuths } from '../../db/entities/api_auths.entity';
import { RefreshToken } from '../../db/entities/refresh_token.entity';

import { compare } from '../../utils/bcrypt';
import { ApiAuthsModule } from './api-auths/api-auths.module';
import importExportFeature from '@adminjs/import-export';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormsettings = require('../../../ormconfig');

Resource.validate = validate;
AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../../', 'documentation'),
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot(ormsettings),
    AdminJsModule.createAdmin({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [
          {
            resource: ApiAuths,
            options: {
              properties: {
                api_key: {
                  isVisible: {
                    create: false,
                    edit: false,
                    show: true,
                    list: true,
                    filter: false,
                  },
                },
              },
            },
          },
          {
            resource: Lecturer,
            features: [importExportFeature],
          },
          {
            resource: Student,
            features: [importExportFeature],
          },
          {
            resource: Course,
          },
          {
            resource: SuperAdmin,
            options: {
              properties: {
                password: {
                  isVisible: {
                    edit: false,
                    show: false,
                    list: false,
                    filter: false,
                  },
                },
              },
            },
          },
          {
            resource: Admin,
            options: {
              properties: {
                password: {
                  isVisible: {
                    edit: false,
                    show: false,
                    list: false,
                    filter: false,
                  },
                },
              },
            },
          },
          {
            resource: RefreshToken,
            options: {
              actions: {
                edit: {
                  isAccessible: false,
                  isVisible: true,
                },
                new: {
                  isAccessible: false,
                  isVisible: true,
                },
              },
            },
          },
        ],
        branding: {
          companyName: 'David',
          // theme: {
          //   colors: { primary100: '#1C1C38' },
          // },
        },
      },
      auth: {
        authenticate: async (email, password) => {
          const admin = await SuperAdmin.findOneBy({ email });

          if (!admin) return null;

          Logger.log(admin.email);

          if (compare(password, admin.password)) {
            // Logger.log(password);
            return Promise.resolve({ email: admin.email });
          } else return null;
        },
        cookieName: 'david_admin_cook',
        cookiePassword: 'david_admin_pass',
      },
    }),
    LecturersModule,
    StudentsModule,
    CoursesModule,
    AdminModule,
    AuthModule,
    HttpModule,
    NotificationsModule,
    RealtimeLogModule,
    SuperAdminModule,
    SmsModule,
    ApiAuthsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppCacheService, PushNotificationsService],
})
export class AppModule {}
