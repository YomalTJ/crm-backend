import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SamurdhiSubsidyService } from './samurdhi-subsidy.service';
import { CreateSamurdhiSubsidyDto } from './dto/create-samurdhi-subsidy.entity';

@Controller('samurdhi-subsidy')
export class SamurdhiSubsidyController {
    constructor(private service: SamurdhiSubsidyService) {}
    
      @Post()
      create(@Body() dto: CreateSamurdhiSubsidyDto, @Req() req: Request) {
        const staffId = req['user'].userId;
        return this.service.create(dto, staffId);
      }
    
      @Get()
      findAll() {
        return this.service.findAll();
      }
}
