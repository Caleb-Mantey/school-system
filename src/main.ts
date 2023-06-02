import { NestFactory, Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as bodyParser from 'body-parser';

import { AppModule } from './app/modules/app.module';
import { TrimPipe } from './pipes/trim.pipe';
import { ApiGuard } from './app/guards/api.guard';
import { ApiAuthsService } from './app/services/api-auths/api-auths.service';
import { JwtAuthGuard } from './app/guards/jwt-auth.guard';
import { LoggingInterceptor } from './app/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.setGlobalPrefix('api/');
  app.useGlobalGuards(new ApiGuard(app.get(ApiAuthsService), reflector));
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new TrimPipe());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.useStaticAssets(join(__dirname, '../../../../', 'documentation'));
  app.setViewEngine('html');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dropin API')
    .setDescription('Dropin Api Documentation')
    .setVersion('1.0.0')
    .setContact(
      'Mantey Caleb',
      'https://dropinghana.com/',
      'manteycaleb@gmail.com',
    )
    .addApiKey({ type: 'apiKey', name: 'api-key', in: 'header' }, 'api-key')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, swaggerDoc);

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
