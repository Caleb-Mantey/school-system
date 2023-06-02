import {
  Controller,
  Get,
  Param,
  HttpException,
  Body,
  Post,
  Put,
  Delete,
  UsePipes,
  UnprocessableEntityException,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiSecurity,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { LecturersService } from '../../services/lecturer/lecturer.service';

import ILecturer from '../../../db/types/lecturer.interface';

import { FindIdDto } from '../../../db/dto/shared/find_id.dto';
import {
  UpdateLecturerDto,
  CreateLecturerDto,
} from '../../../db/dto/lecturer.dto';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Lecturer')
@ApiSecurity('api-key')
@ApiBearerAuth('access-token')
@Controller('lecturers')
export class LecturersController {
  constructor(private lecturersService: LecturersService) {}

  @Get()
  @ApiOkResponse({ description: 'Returns a list of lecturers' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async index(): Promise<ILecturer[]> {
    return await this.lecturersService.all();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns a lecturer with id' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async show(@Param() params: FindIdDto): Promise<ILecturer> {
    try {
      const lecturer = await this.lecturersService.find(params.id);
      return lecturer;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: 'Creates a new lecturer' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in your request',
  })
  async create(
    @Body() createLecturerDto: CreateLecturerDto,
  ): Promise<ILecturer> {
    try {
      const lecturer = await this.lecturersService.create(createLecturerDto);
      return lecturer;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Updates a lecturer record' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in your request',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
  })
  async update(
    @Param() params: FindIdDto,
    @Body() updateLecturerDto: UpdateLecturerDto,
    @Req() req,
  ) {
    try {
      const lecturer = await this.lecturersService.update(
        req.user.userId || params.id,
        updateLecturerDto,
      );
      return lecturer;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a lecturer' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async destroy(@Param() params: FindIdDto) {
    try {
      const lecturer = await this.lecturersService.delete(params.id);
      return lecturer;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }
}
