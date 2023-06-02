import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SuperAdmin } from '../../../db/entities/super_admin.entity';
import ISuperAdmin from '../../../db/types/super_admin.interface';
import {
  CreateSuperAdminDto,
  UpdateSuperAdminDto,
} from '../../../db/dto/super_admin.dto';
import { encode, compare } from '../../../utils/bcrypt';
import { AdminLoginDto } from '../../../db/dto/admin_login.dto';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(SuperAdmin)
    private readonly superAdminRepository: Repository<SuperAdmin>,
    private eventEmitter: EventEmitter2,
  ) {}

  all(): Promise<ISuperAdmin[]> {
    return this.superAdminRepository.find();
  }

  find(id: number): Promise<ISuperAdmin> {
    return this.superAdminRepository.findOneByOrFail({ id: id });
  }

  async findByEmailAndPassword(
    adminLoginDto: AdminLoginDto,
  ): Promise<ISuperAdmin | undefined> {
    const admin = await this.superAdminRepository.findOneBy({
      email: adminLoginDto.email,
    });
    if (!admin) return;
    if (compare(adminLoginDto.password, admin.password)) return admin;
    return;
  }

  create(createSuperAdminDto: CreateSuperAdminDto): Promise<ISuperAdmin> {
    const admin = this.superAdminRepository.create(createSuperAdminDto);
    // if (createSuperAdminDto.password != null) {
    //   createSuperAdminDto.password = encode(createSuperAdminDto.password);
    // }
    return this.superAdminRepository.save(admin);
  }

  @OnEvent('admin.create')
  async initialAdminSetup(newAdmin: ISuperAdmin) {
    const admins = await this.all();

    Logger.log('Checking Env for existing super admin');

    if (admins.length > 0) {
      Logger.log('Super Admin exists already. Check Completed!');
      return;
    }

    Logger.log('No Super Admin exists creating one.......');
    Logger.log(newAdmin);

    const admin = this.superAdminRepository.create(newAdmin);
    await this.superAdminRepository.save(admin);
    Logger.log(
      `Super Admin created successfully\nEmail: ${newAdmin.email}\nPassword: ${newAdmin.password}`,
    );
    this.eventEmitter.emit(
      'send.slack',
      `Dropin Ghana\nNew Super Admin Created for ${process.env.ENV.toUpperCase()} Environment\nEmail: ${
        newAdmin.email
      }\nPassword: ${newAdmin.password}`,
    );
  }

  async update(
    id: number,
    updateSuperAdminDto: UpdateSuperAdminDto,
  ): Promise<ISuperAdmin> {
    let admin = await this.find(id);

    if (updateSuperAdminDto.password != null) {
      updateSuperAdminDto.password = encode(updateSuperAdminDto.password);
    }

    admin = { ...admin, ...updateSuperAdminDto };
    return this.superAdminRepository.save(admin);
  }

  async delete(id: number): Promise<ISuperAdmin> {
    const admin = await this.superAdminRepository.findOneByOrFail({ id });
    return this.superAdminRepository.remove(admin);
  }
}
