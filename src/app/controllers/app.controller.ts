import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('http://localhost:4000/')
  root() {
    return [];
  }
}
