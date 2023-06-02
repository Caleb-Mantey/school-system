import {
  Controller,
  Get,
  Param,
  HttpException,
  Post,
  Body,
  UnprocessableEntityException,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiSecurity,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { SuperAdminService } from '../../services/super-admin/super-admin.service';
import ISuperAdmin from '../../../db/types/super_admin.interface';
import { FindIdDto } from '../../../db/dto/shared/find_id.dto';
import {
  CreateSuperAdminDto,
  UpdateSuperAdminDto,
} from '../../../db/dto/super_admin.dto';

@ApiTags('Super Admin')
@ApiSecurity('api-key')
@ApiBearerAuth('access-token')
@Controller('super-admin')
export class SuperAdminController {
  constructor(private superAdminService: SuperAdminService) {}

  @Get()
  @ApiOkResponse({ description: 'Returns a list of admin' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async index(): Promise<ISuperAdmin[]> {
    return await this.superAdminService.all();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns a single admin' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async show(@Param() params: FindIdDto): Promise<ISuperAdmin> {
    try {
      const admin = await this.superAdminService.find(params.id);
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
  async create(
    @Body() createSuperAdminDto: CreateSuperAdminDto,
  ): Promise<ISuperAdmin> {
    try {
      const admin = await this.superAdminService.create(createSuperAdminDto);
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
    @Body() updateSuperAdminDto: UpdateSuperAdminDto,
  ): Promise<UpdateSuperAdminDto> {
    try {
      const admin = await this.superAdminService.update(
        params.id,
        updateSuperAdminDto,
      );
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
  async destroy(@Param() params: FindIdDto): Promise<ISuperAdmin> {
    try {
      const admin = await this.superAdminService.delete(params.id);
      return admin;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, 404);
    }
  }
}
