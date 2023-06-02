import { Global, Module } from '@nestjs/common';
import { ApiAuthsService } from '../../services/api-auths/api-auths.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiAuths } from '../../../db/entities/api_auths.entity';

@Global()
@Module({
  providers: [ApiAuthsService],
  imports: [TypeOrmModule.forFeature([ApiAuths])],
})
export class ApiAuthsModule {}
