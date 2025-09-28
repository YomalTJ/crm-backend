// staff.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Res,
  SetMetadata,
  Query,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffLoginDto } from './dto/staff-login.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', ['National Level User'])
  create(@Body() dto: CreateStaffDto, @Req() req: Request) {
    const userId = req['user'].userId;
    return this.staffService.create(dto, userId);
  }

  // New endpoint to create multiple staff records for different locations
  @Post('multiple')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('roles', ['National Level User'])
  createMultiple(@Body() dtos: CreateStaffDto[], @Req() req: Request) {
    const userId = req['user'].userId;
    return this.staffService.createMultiple(dtos, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request) {
    const userId = req['user'].userId;
    return this.staffService.findAll(userId);
  }

  // New endpoint to find all staff records for a specific username
  @Get('username/:username')
  @UseGuards(AuthGuard)
  findByUsername(@Param('username') username: string, @Req() req: Request) {
    const userId = req['user'].userId;
    return this.staffService.findByUsername(username, userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'].userId;
    return this.staffService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStaffDto,
    @Req() req: Request,
  ) {
    const userId = req['user'].userId;
    return this.staffService.update(id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user'].userId;
    return this.staffService.remove(id, userId);
  }

  // New endpoint to remove all staff records for a specific username
  @Delete('username/:username')
  @UseGuards(AuthGuard)
  removeByUsername(@Param('username') username: string, @Req() req: Request) {
    const userId = req['user'].userId;
    return this.staffService.removeByUsername(username, userId);
  }

  @Post('login')
  login(@Body() dto: StaffLoginDto) {
    return this.staffService.staffLogin(dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token =
      req.cookies?.['staffAccessToken'] ||
      req.cookies?.['staff_access_token'] ||
      req.headers.authorization?.split(' ')[1];

    if (token) {
      await this.authService.logout(token);
    }

    res.clearCookie('staff_access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out successfully' };
  }
}
