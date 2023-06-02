import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course as CoursesEntity } from '../../../db/entities/courses.entity';
import { Repository } from 'typeorm';
import {
  CreateCoursesDto,
  UpdateCoursesDto,
} from '../../../db/dto/courses.dto';
import ICourses from '../../../db/types/courses.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CoursesEntity)
    private coursesRepository: Repository<CoursesEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  all(): Promise<ICourses[]> {
    return this.coursesRepository.find();
  }

  find(id: number): Promise<ICourses> {
    return this.coursesRepository.findOneOrFail({ where: { id } });
  }

  create(createCoursesDto: CreateCoursesDto): Promise<ICourses> {
    const courses = this.coursesRepository.create(createCoursesDto);
    return this.coursesRepository.save(courses);
  }

  async update(
    id: number,
    updateCoursesDto: UpdateCoursesDto,
  ): Promise<ICourses> {
    let courses = await this.find(id);

    courses = { ...courses, ...updateCoursesDto };

    return this.coursesRepository.save(courses);
  }

  async delete(id: number): Promise<ICourses> {
    const courses = await this.coursesRepository.findOneByOrFail({ id });
    return this.coursesRepository.remove(courses);
  }
}
