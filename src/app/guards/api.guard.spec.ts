import { Test, TestingModule } from '@nestjs/testing';
import { ApiGuard } from './api.guard';
import { ApiAuthsService } from '../services/api-auths/api-auths.service';
import { Repository } from 'typeorm';
import { ApiAuths } from '../../db/entities/api_auths.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('ApiGuard', () => {
  let service: ApiAuthsService;
  let guard: ApiGuard;
  let contextMock: ExecutionContext;

  const api_key = 'djkadjkashsajhd';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiAuthsService, Reflector],
    })
      .overrideProvider(ApiAuthsService)
      .useValue({
        verify_key: jest.fn((key) => new Promise((resolve) => resolve(true))),
      })
      .compile();

    service = module.get<ApiAuthsService>(ApiAuthsService);
    guard = new ApiGuard(service, module.get<Reflector>(Reflector));

    contextMock = {
      getArgs: (): any => {
        return { data: '' };
      },
      getType: (): any => {
        return { data: '' };
      },
      getArgByIndex: (): any => {
        return { data: '' };
      },
      getClass: (): any => {
        return { data: '' };
      },
      switchToRpc: (): any => {
        return { data: '' };
      },
      switchToWs: (): any => {
        return { data: '' };
      },
      getHandler: () => {
        return () => {
          {
            data: '';
          }
        };
      },
      switchToHttp: () => {
        return {
          getRequest: (): any => {
            return {
              headers: {
                'api-key': api_key,
              },
            };
          },
          getResponse: (): any => {
            data: '';
          },
          getNext: (): any => {
            data: '';
          },
        };
      },
    };
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should define auth service', () => {
    expect(service).toBeDefined();
  });

  it('should call the verify_key method when can_activate guard method is invoked', async () => {
    expect(await guard.canActivate(contextMock)).toBe(true);
    expect(service.verify_key).toHaveBeenCalledTimes(1);
    expect(service.verify_key).toHaveBeenCalledWith(api_key);
  });
});
