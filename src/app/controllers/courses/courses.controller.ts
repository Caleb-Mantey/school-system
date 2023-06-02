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

import { CoursesService } from '../../services/courses/courses.service';

import ICourses from '../../../db/types/courses.interface';

import { FindIdDto } from '../../../db/dto/shared/find_id.dto';
import {
  UpdateCoursesDto,
  CreateCoursesDto,
} from '../../../db/dto/courses.dto';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Courses')
@ApiSecurity('api-key')
@ApiBearerAuth('access-token')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @ApiOkResponse({ description: 'Returns a list of courses' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async index(): Promise<ICourses[]> {
    return await this.coursesService.all();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns a courses with id' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async show(@Param() params: FindIdDto): Promise<ICourses> {
    try {
      const courses = await this.coursesService.find(params.id);
      return courses;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: 'Creates a new courses' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in your request',
  })
  async create(@Body() createCoursesDto: CreateCoursesDto): Promise<ICourses> {
    try {
      const courses = await this.coursesService.create(createCoursesDto);
      return courses;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Updates a courses record' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in your request',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
  })
  async update(
    @Param() params: FindIdDto,
    @Body() updateCoursesDto: UpdateCoursesDto,
    @Req() req,
  ) {
    try {
      const courses = await this.coursesService.update(
        req.user.userId || params.id,
        updateCoursesDto,
      );
      return courses;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a courses' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async destroy(@Param() params: FindIdDto) {
    try {
      const courses = await this.coursesService.delete(params.id);
      return courses;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }
}
