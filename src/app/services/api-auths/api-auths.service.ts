import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiAuths } from '../../../db/entities/api_auths.entity';

@Injectable()
export class ApiAuthsService {
  constructor(
    @InjectRepository(ApiAuths)
    private apiAuthsRepository: Repository<ApiAuths>,
  ) {}

  async verify_key(api_key: string): Promise<boolean> {
    const key = await this.apiAuthsRepository
      .createQueryBuilder('api_auths')
      .where('api_key = :api_key AND active = true', { api_key: api_key })
      .getOne();

    return key != null;
  }
}
