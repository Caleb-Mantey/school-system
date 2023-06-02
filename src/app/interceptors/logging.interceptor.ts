import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    Logger.verbose(
      `Requesting [${context.getClass().name}#{${
        context.getHandler().name
      }}].......`,
    );
    const request = context.switchToHttp().getRequest();

    Logger.log(`${request.method}`);
    Logger.log(`Params: `, request.params);
    Logger.log(`Body: `, request.body);

    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.verbose(`Responded After ${Date.now() - now}ms.......`),
        ),
      );
  }
}
