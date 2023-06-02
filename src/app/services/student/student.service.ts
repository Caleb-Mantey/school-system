import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student as StudentEntity } from '../../../db/entities/student.entity';
import { Repository } from 'typeorm';
import {
  CreateStudentDto,
  UpdateStudentDto,
} from '../../../db/dto/student.dto';
import IStudent from '../../../db/types/student.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  all(): Promise<IStudent[]> {
    return this.studentRepository.find();
  }

  find(id: number): Promise<IStudent> {
    return this.studentRepository.findOneOrFail({ where: { id } });
  }

  findByPhone(phone: string): Promise<IStudent> {
    return this.studentRepository.findOneBy({ phone: phone });
  }

  findByEmail(email: string): Promise<IStudent> {
    return this.studentRepository.findOneBy({ email: email });
  }

  create(createStudentDto: CreateStudentDto): Promise<IStudent> {
    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<IStudent> {
    let student = await this.find(id);

    student = { ...student, ...updateStudentDto };

    return this.studentRepository.save(student);
  }

  async delete(id: number): Promise<IStudent> {
    const student = await this.studentRepository.findOneByOrFail({ id });
    return this.studentRepository.remove(student);
  }
}
