import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  HttpException,
  Delete,
  UsePipes,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiBasicAuth,
  ApiSecurity,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AdminService } from '../../services/admin/admin.service';

import IAdmin from '../../../db/types/admin.interface';

import { FindIdDto } from '../../../db/dto/shared/find_id.dto';
import { CreateAdminDto, UpdateAdminDto } from '../../../db/dto/admin.dto';

@ApiTags('Admin')
@ApiSecurity('api-key')
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  @ApiOkResponse({ description: 'Returns a list of admin' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async index(): Promise<IAdmin[]> {
    return await this.adminService.all();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns a single admin' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async show(@Param() params: FindIdDto): Promise<IAdmin> {
    try {
      const admin = await this.adminService.find(params.id);
      return admin;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: 'Creates a new admin' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in your request',
  })
  async create(@Body() createAdminDto: CreateAdminDto): Promise<IAdmin> {
    try {
      const admin = await this.adminService.create(createAdminDto);
      return admin;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Updates a admin record' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in your request',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
  })
  async update(
    @Param() params: FindIdDto,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<UpdateAdminDto> {
    try {
      const admin = await this.adminService.update(params.id, updateAdminDto);
      return admin;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, 404);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a admin' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async destroy(@Param() params: FindIdDto): Promise<IAdmin> {
    try {
      const admin = await this.adminService.delete(params.id);
      return admin;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, 404);
    }
  }
}
