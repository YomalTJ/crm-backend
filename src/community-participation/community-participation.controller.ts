import { Body, Controller, Get, Post, Req, Query } from '@nestjs/common';
import { CommunityParticipationService } from './community-participation.service';
import { CreateCommunityParticipationDto } from './dto/create-community-participation.dto';

@Controller('community-participation')
export class CommunityParticipationController {
  constructor(private readonly service: CommunityParticipationService) {}

  @Post()
  create(@Body() dto: CreateCommunityParticipationDto, @Req() req: Request) {
    const staffId = req['user'].userId;
    return this.service.create(dto, staffId);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
