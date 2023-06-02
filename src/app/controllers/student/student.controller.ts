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

import { StudentsService } from '../../services/student/student.service';

import IStudent from '../../../db/types/student.interface';

import { FindIdDto } from '../../../db/dto/shared/find_id.dto';
import {
  UpdateStudentDto,
  CreateStudentDto,
} from '../../../db/dto/student.dto';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Student')
@ApiSecurity('api-key')
@ApiBearerAuth('access-token')
@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  @ApiOkResponse({ description: 'Returns a list of students' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async index(): Promise<IStudent[]> {
    return await this.studentsService.all();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns a student with id' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async show(@Param() params: FindIdDto): Promise<IStudent> {
    try {
      const student = await this.studentsService.find(params.id);
      return student;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }

  @Post()
  @ApiCreatedResponse({ description: 'Creates a new student' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in your request',
  })
  async create(@Body() createStudentDto: CreateStudentDto): Promise<IStudent> {
    try {
      const student = await this.studentsService.create(createStudentDto);
      return student;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Updates a student record' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some properties in your request',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
  })
  async update(
    @Param() params: FindIdDto,
    @Body() updateStudentDto: UpdateStudentDto,
    @Req() req,
  ) {
    try {
      const student = await this.studentsService.update(
        req.user.userId || params.id,
        updateStudentDto,
      );
      return student;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a student' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `id` property in get params',
  })
  async destroy(@Param() params: FindIdDto) {
    try {
      const student = await this.studentsService.delete(params.id);
      return student;
    } catch (err) {
      console.log({ ...err });
      throw new HttpException(err.message, 404);
    }
  }
}
