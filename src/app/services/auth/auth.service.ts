import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as otpGenerator from 'otp-generator';

import { sign, verify } from 'jsonwebtoken';

import { RefreshToken } from '../../../db/entities/refresh_token.entity';

import { CreateStudentDto } from '../../../db/dto/student.dto';
import { CreateLecturerDto } from '../../../db/dto/lecturer.dto';
import { AdminLoginDto } from '../../../db/dto/admin_login.dto';

import { StudentsService } from '../student/student.service';
import { AppCacheService } from '../../cache/app.cache.service';
import { LecturersService } from '../lecturer/lecturer.service';
import { AdminService } from '../admin/admin.service';
import ILecturer from '../../../db/types/lecturer.interface';
import IStudent from '../../../db/types/student.interface';
import IAdmin from '../../../db/types/admin.interface';
import { SlackService } from 'nestjs-slack';
import { MessageCopies } from '../../../utils/message_copies';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentsService,
    private readonly lecturersService: LecturersService,
    private readonly adminService: AdminService,
    @InjectRepository(RefreshToken)
    private refreshRepository: Repository<RefreshToken>,
    private readonly cacheService: AppCacheService,
    private readonly slackService: SlackService,
    private eventEmitter: EventEmitter2,
  ) {}

  otpMessage(code) {
    return MessageCopies.otp(code);
  }

  async refresh(
    refreshStr: string,
  ): Promise<{ accessToken: string } | undefined> {
    const refreshToken = await this.retrieveRefreshToken(refreshStr);

    if (!refreshToken) {
      throw new BadRequestException('Invalid Refresh Token');
    }

    let user;
    if (refreshToken.account_type.toLowerCase() == 'student')
      user = await this.studentService.find(refreshToken.userId);
    else if (refreshToken.account_type.toLowerCase() == 'admin')
      user = await this.adminService.find(refreshToken.userId);
    else user = await this.lecturersService.find(refreshToken.userId);

    if (!user) {
      throw new NotFoundException(
        "Can't find user with RefreshToken: " + refreshStr,
      );
    }

    const accessToken = {
      userId: refreshToken.userId,
    };

    return {
      accessToken: sign(accessToken, process.env.ACCESS_SECRET, {
        // expiresIn: '1d',
      }),
    };
  }

  private retrieveRefreshToken(
    refreshStr: string,
  ): Promise<RefreshToken | undefined> {
    try {
      const decoded = verify(refreshStr, process.env.REFRESH_SECRET);
      if (typeof decoded === 'string') {
        return undefined;
      }
      return this.refreshRepository.findOneOrFail(decoded.id);
    } catch (e) {
      return undefined;
    }
  }

  async login(
    phone: string,
    values: {
      userAgent: string;
      ipAddress: string;
      account_type: string;
    },
  ): Promise<
    | { accessToken: string; refreshToken: string; user: any; state: string }
    | { state: string; otp: string }
  > {
    // check if user exists and send otp and accessToken.
    let user;

    if (values.account_type.toLowerCase() == 'student')
      user = await this.studentService.findByPhone(phone);
    else user = await this.lecturersService.findByPhone(phone);
    // generate otp and store otp and phone number.
    const otp_code = user?.test_user ? '0000' : this.generateOtp();

    await this.cacheService.setCache(phone, otp_code, 900000);

    const otp_message = this.otpMessage(otp_code);
    // send otp as sms

    // Logger.log(process.env.ENV);
    if (process.env.ENV != 'development' && !user?.test_user)
      this.eventEmitter.emit('send.sms', {
        number: phone,
        message: otp_message,
      });

    // if user does not exist send response to be sign up
    if (!user) {
      const slackResponse = `Sign Up\nPhone: ${phone}\SMS: ${otp_message}`;
      this.slackService.sendText(slackResponse, { channel: 'otps' });
      this.eventEmitter.emit('send.telegram', slackResponse);

      return { state: 'register', otp: otp_code };
    }

    const details = `User: ${user.first_name} ${
      user.last_name
    }\nAccount Type: ${
      values.account_type.toLowerCase() == 'student' ? 'Student' : 'Lecturer'
    }`;
    const slackResponse = `Log In\nPhone: ${phone}\n${details}\nSMS: ${otp_message}`;
    this.slackService.sendText(slackResponse, { channel: 'otps' });
    this.eventEmitter.emit('send.telegram', slackResponse);
    return this.newRefreshAndAccessToken(user, values);
  }

  async adminLogin(
    adminLoginDto: AdminLoginDto,
    values: {
      userAgent: string;
      ipAddress: string;
    },
  ): Promise<
    | { accessToken: string; refreshToken: string; user: any }
    | { state: string; otp: string }
  > {
    const user = await this.adminService.findByEmailAndPassword(adminLoginDto);

    // if user does not exist send response throw error
    if (!user) {
      throw new UnauthorizedException(
        'Sorry wrong email and password combination',
      );
    }

    const otp_code = this.generateOtp();

    await this.cacheService.setCache(user.phone, otp_code, 900000);

    // const otp_message = this.otpMessage(otp_code);
    // send otp as sms

    // await this.smsService.send_sms(user.phone, otp_message);

    return this.newRefreshAndAccessToken(user, {
      ...values,
      account_type: 'Admin',
    });
  }

  async confirmOtp(otp_code: string, phone: string) {
    // let user;
    // if (type == 'Student') user = await this.studentService.findByPhone(phone);
    // else user = await this.lecturersService.findByPhone(phone);

    const otp = await this.cacheService.getCache(phone);
    if (!otp) throw new UnprocessableEntityException('Otp Code Expired');

    if (otp === otp_code) {
      this.cacheService.deleteCache(phone);
      return { status: 'success', message: 'Otp Code was verified' };
    } else {
      throw new UnauthorizedException('Sorry a wrong otp code was entered');
    }
  }

  async showOtp(phone: string) {
    const otp = await this.cacheService.getCache(phone);
    return { otp };
  }

  async resendOtp(phone: string) {
    const otp_code = this.generateOtp();

    await this.cacheService.setCache(phone, otp_code, 900000);

    // send otp as sms
    const otp_message = this.otpMessage(otp_code);
    this.eventEmitter.emit('send.sms', {
      number: phone,
      message: otp_message,
    });

    return { status: 'success', otp: otp_code };
  }

  async register(
    user: any,
    values: { userAgent: string; ipAddress: string; account_type: string },
  ) {
    if (values.account_type.toLowerCase() == 'student')
      return this.registerStudent(user, values);
    else return this.registerLecturer(user, values);
  }

  async registerStudent(
    student: CreateStudentDto,
    values: { userAgent: string; ipAddress: string; account_type: string },
  ): Promise<
    { accessToken: string; refreshToken: string; user: any } | undefined
  > {
    try {
      const user = await this.studentService.create({ ...student });
      return this.newRefreshAndAccessToken(user, values);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  async registerLecturer(
    lecturer: CreateLecturerDto,
    values: { userAgent: string; ipAddress: string; account_type: string },
  ): Promise<
    { accessToken: string; refreshToken: string; user: any } | undefined
  > {
    try {
      const user = await this.lecturersService.create(lecturer);
      return this.newRefreshAndAccessToken(user, values);
    } catch (error) {
      Logger.log(error);
      throw new UnprocessableEntityException(error.message);
    }
  }

  generateOtp(): string {
    return otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
  }

  private async newRefreshAndAccessToken(
    user: ILecturer | IStudent | IAdmin,
    values: { userAgent: string; ipAddress: string; account_type: string },
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: ILecturer | IStudent | IAdmin;
    state: string;
  }> {
    const refreshObject = new RefreshToken({
      userId: user.id,
      ...values,
    });
    const token = await this.refreshRepository.create(refreshObject);
    await this.refreshRepository.save(token);

    return {
      refreshToken: refreshObject.sign(),
      accessToken: sign({ userId: user.id }, process.env.ACCESS_SECRET, {
        // expiresIn: '1d',
      }),
      user,
      state: 'login',
    };
  }

  async logout(refreshString: string) {
    const refreshToken = await this.retrieveRefreshToken(refreshString);

    if (!refreshToken) throw new BadRequestException('Invalid Refresh Token');

    await this.deleteToken(refreshToken.id);
  }

  async deleteToken(id: number) {
    const token = await this.refreshRepository.findOneByOrFail({ id });
    this.refreshRepository.remove(token);
  }
}
