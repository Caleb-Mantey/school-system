import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Admin as AdminEntity } from '../../../db/entities/admin.entity';

import IAdmin from '../../../db/types/admin.interface';

import { CreateAdminDto, UpdateAdminDto } from '../../../db/dto/admin.dto';
import { AdminLoginDto } from '../../../db/dto/admin_login.dto';

import { compare, encode } from '../../../utils/bcrypt';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  all(): Promise<IAdmin[]> {
    return this.adminRepository.find();
  }

  find(id: number): Promise<IAdmin> {
    return this.adminRepository.findOneByOrFail({ id: id });
  }

  async findByEmailAndPassword(
    adminLoginDto: AdminLoginDto,
  ): Promise<IAdmin | undefined> {
    const admin = await this.adminRepository.findOneBy({
      email: adminLoginDto.email,
    });

    if (!admin) return;

    if (compare(adminLoginDto.password, admin.password)) return admin;

    return;
  }

  @OnEvent('admin.create')
  async initialAdminSetup(newAdmin: CreateAdminDto) {
    const admins = await this.all();

    Logger.log('Checking Env for existing admin');

    if (admins.length > 0) {
      Logger.log('Admin exists already. Check Completed!');
      return;
    }

    Logger.log('No Admin exists creating one.......');
    Logger.log(newAdmin);

    const admin = this.adminRepository.create(newAdmin);
    await this.adminRepository.save(admin);
    Logger.log(
      `Admin created successfully\nEmail: ${newAdmin.email}\nPassword: ${newAdmin.password}`,
    );
    this.eventEmitter.emit(
      'send.slack',
      `Dropin Ghana\nNew Admin Created for ${process.env.ENV.toUpperCase()} Environment\nEmail: ${
        newAdmin.email
      }\nPassword: ${newAdmin.password}`,
    );
  }

  create(createAdminDto: CreateAdminDto): Promise<IAdmin> {
    const admin = this.adminRepository.create(createAdminDto);

    return this.adminRepository.save(admin);
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<IAdmin> {
    let admin = await this.find(id);

    if (updateAdminDto.password != null) {
      updateAdminDto.password = encode(updateAdminDto.password);
    }

    admin = { ...admin, ...updateAdminDto };

    return this.adminRepository.save(admin);
  }

  async delete(id: number): Promise<IAdmin> {
    const admin = await this.adminRepository.findOneByOrFail({ id });

    return this.adminRepository.remove(admin);
  }
}
