import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiAuthsService } from '../services/api-auths/api-auths.service';
import { Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiGuard implements CanActivate {
  constructor(
    @Inject('ApiAuthsService')
    private readonly authService: ApiAuthsService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const ignoreApiKey = this.reflector.get<boolean>(
      'ignore-api-key',
      context.getHandler(),
    );

    if (ignoreApiKey) return true;
    // Logger.log(request.headers);
    // Logger.log(request.headers['api-key']);
    return this.authService.verify_key(request.headers['api-key']);
  }
}
