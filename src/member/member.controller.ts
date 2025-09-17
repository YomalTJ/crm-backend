import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { Request } from 'express';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginMemberDto } from './dto/login-member.dto';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  create(@Body() dto: CreateMemberDto, @Req() req: Request) {
    const userid = req['user']?.userId;
    return this.memberService.create(dto, userid);
  }

  @Get()
  findAll(@Req() req: Request) {
    const userId = req['user']?.userId;
    return this.memberService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user']?.userId;
    return this.memberService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
    @Req() req: Request,
  ) {
    const userId = req['user']?.userId;
    return this.memberService.update(id, dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req['user']?.userId;
    this.memberService.remove(id, userId);
    return { message: 'Member deleted successfully' };
  }

  @Patch(':id/password')
  updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
    @Req() req: Request,
  ) {
    const userId = req['user']?.userId;
    return this.memberService.updatePassword(id, userId, dto);
  }

  @Post('login')
  login(@Body() dto: LoginMemberDto) {
    return this.memberService.login(dto);
  }
}
