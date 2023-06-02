import {
  Body,
  Controller,
  Delete,
  Ip,
  Logger,
  Param,
  Post,
  Req,
  Get,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiSecurity,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

import { AuthService } from '../../services/auth/auth.service';

import { MobileLoginDto } from '../../../db/dto/mobile_login.dto';
import { RefreshTokenDto } from '../../../db/dto/refresh_token.dto';
import { OtpDto } from '../../../db/dto/otp.dto';
import { CreateStudentDto } from '../../../db/dto/student.dto';
import { PhoneDto } from '../../../db/dto/phone.dto';
import { AdminLoginDto } from '../../../db/dto/admin_login.dto';
import { CreateLecturerDto } from '../../../db/dto/lecturer.dto';
import { IsPublic } from '../../decorators/is_public.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';

@ApiTags('Authentication')
@ApiSecurity('api-key')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @IsPublic()
  @Post('admin/login')
  @ApiCreatedResponse({ description: 'Login for Admins' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Invalid email or password',
  })
  @ApiUnauthorizedResponse({
    description: 'Wrong Email or password combination',
  })
  async adminLogin(
    @Req() req,
    @Ip() ip: string,
    @Body() adminLoginDto: AdminLoginDto,
  ) {
    Logger.log(adminLoginDto);
    return this.authService.adminLogin(adminLoginDto, {
      ipAddress: ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @IsPublic()
  @Post('mobile/login')
  @ApiCreatedResponse({ description: 'Login for Students and Lecturers' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Invalid Phone number',
  })
  async login(@Req() req, @Ip() ip: string, @Body() body: MobileLoginDto) {
    return this.authService.login(body.phone, {
      account_type: body.type,
      ipAddress: ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @IsPublic()
  @Post('mobile/register')
  @ApiCreatedResponse({ description: 'Sign up for Students and Lecturers' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing some important attribute',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Email or phone number already exists',
  })
  async register(
    @Body() body: CreateStudentDto | CreateLecturerDto,
    @Req() req,
    @Ip() ip: string,
  ) {
    try {
      return this.authService.register(body, {
        account_type: body.account_type,
        ipAddress: ip,
        userAgent: req.headers['user-agent'],
      });
    } catch (error) {
      this.eventEmitter.emit(
        'send.telegram',
        `Failed User Sign Up\n${JSON.stringify(body)}`,
      );

      throw new UnprocessableEntityException(error.message);
    }
  }

  @IsPublic()
  @ApiCreatedResponse({ description: 'Confirm otp' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized! Wrong otp code was entered',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Otp code expired or has been permanently deleted',
  })
  // @UseGuards(JwtAuthGuard)
  @Post('mobile/otp')
  async otpConfirmation(@Body() body: OtpDto, @Req() req) {
    return this.authService.confirmOtp(body.otp_code, body.phone);
  }

  @IsPublic()
  @Get('mobile/otp/:phone')
  @ApiOkResponse({ description: 'Get otp code for a user' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Missing `phone` number in get params',
  })
  async showOtp(@Param() params: PhoneDto) {
    return this.authService.showOtp(params.phone);
  }

  @IsPublic()
  @ApiCreatedResponse({ description: 'Resend otp' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Invalid Phone number',
  })
  @Post('mobile/resend_otp/')
  async resendOtp(@Body() body: PhoneDto) {
    return this.authService.resendOtp(body.phone);
  }

  @IsPublic()
  @ApiCreatedResponse({ description: 'Refresh User Token' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Invalid Refresh Token',
  })
  @ApiNotFoundResponse({
    description: 'User with this refresh token does not exist',
  })
  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refreshToken);
  }

  @IsPublic()
  @ApiOkResponse({ description: 'Log user out' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBadRequestResponse({
    description: 'Bad Request! Invalid Refresh Token',
  })
  @Delete('logout')
  async logout(@Body() body: RefreshTokenDto) {
    return this.authService.logout(body.refreshToken);
  }
}
