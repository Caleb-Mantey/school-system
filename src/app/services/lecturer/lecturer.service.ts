import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecturer as LecturerEntity } from '../../../db/entities/lecturer.entity';
import { Repository } from 'typeorm';
import {
  CreateLecturerDto,
  UpdateLecturerDto,
} from '../../../db/dto/lecturer.dto';
import ILecturer from '../../../db/types/lecturer.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class LecturersService {
  constructor(
    @InjectRepository(LecturerEntity)
    private lecturerRepository: Repository<LecturerEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  all(): Promise<ILecturer[]> {
    return this.lecturerRepository.find();
  }

  find(id: number): Promise<ILecturer> {
    return this.lecturerRepository.findOneOrFail({ where: { id } });
  }

  findByPhone(phone: string): Promise<ILecturer> {
    return this.lecturerRepository.findOneBy({ phone: phone });
  }

  findByEmail(email: string): Promise<ILecturer> {
    return this.lecturerRepository.findOneBy({ email: email });
  }

  create(createLecturerDto: CreateLecturerDto): Promise<ILecturer> {
    const lecturer = this.lecturerRepository.create(createLecturerDto);
    return this.lecturerRepository.save(lecturer);
  }

  async update(
    id: number,
    updateLecturerDto: UpdateLecturerDto,
  ): Promise<ILecturer> {
    let lecturer = await this.find(id);

    lecturer = { ...lecturer, ...updateLecturerDto };

    return this.lecturerRepository.save(lecturer);
  }

  async delete(id: number): Promise<ILecturer> {
    const lecturer = await this.lecturerRepository.findOneByOrFail({ id });
    return this.lecturerRepository.remove(lecturer);
  }
}
